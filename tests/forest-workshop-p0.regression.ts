// Forest Workshop P0 regressions: the byte-level resident picture rules and the package's no-generation contract.
// Run: npx tsx tests/forest-workshop-p0.regression.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";
import {
  MAX_INPUT_BYTES,
  inspectResidentImageInput,
} from "../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/images/image-input";

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(width: number, height: number, extra: Buffer[] = []): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const rows = Buffer.alloc(Math.min(height, 4) * (1 + Math.min(width, 4) * 4));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    ...extra,
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function riff(chunks: Buffer[]): Buffer {
  const body = Buffer.concat([Buffer.from("WEBP", "ascii"), ...chunks]);
  const size = Buffer.alloc(4);
  size.writeUInt32LE(body.length);
  return Buffer.concat([Buffer.from("RIFF", "ascii"), size, body]);
}

function webpChunk(type: string, data: Buffer): Buffer {
  const size = Buffer.alloc(4);
  size.writeUInt32LE(data.length);
  return Buffer.concat([Buffer.from(type, "ascii"), size, data, data.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0)]);
}

function vp8l(width: number, height: number): Buffer {
  const data = Buffer.alloc(5);
  data[0] = 0x2f;
  data.writeUInt32LE(((width - 1) & 0x3fff) | (((height - 1) & 0x3fff) << 14), 1);
  return webpChunk("VP8L", data);
}

function vp8x(width: number, height: number, flags: number): Buffer {
  const data = Buffer.alloc(10);
  data[0] = flags;
  data.writeUIntLE(width - 1, 4, 3);
  data.writeUIntLE(height - 1, 7, 3);
  return webpChunk("VP8X", data);
}

function expectError(buffer: Buffer, error: string, label: string) {
  const result = inspectResidentImageInput(buffer);
  assert.equal(result.ok, false, `${label} must be refused`);
  if (!result.ok) assert.equal(result.error, error, label);
}

// Accepted inputs.
{
  const result = inspectResidentImageInput(png(640, 960));
  assert.deepEqual(result, { ok: true, image: { format: "png", width: 640, height: 960 } });
  const lossless = inspectResidentImageInput(riff([vp8l(300, 500)]));
  assert.deepEqual(lossless, { ok: true, image: { format: "webp", width: 300, height: 500 } });
  const extended = inspectResidentImageInput(riff([vp8x(4096, 4096, 0x10), vp8l(4096, 4096)]));
  assert.deepEqual(extended, { ok: true, image: { format: "webp", width: 4096, height: 4096 } });
}

// Refused inputs keep their own reason, so the player sees why and the old picture stays.
expectError(Buffer.alloc(0), "empty", "empty file");
expectError(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), "unsupported_format", "SVG renamed to .png");
expectError(Buffer.from("GIF89a"), "unsupported_format", "GIF");
expectError(png(64, 64).subarray(0, 40), "corrupt", "truncated PNG");
expectError(png(64, 64, [chunk("acTL", Buffer.alloc(8))]), "animated", "APNG");
expectError(riff([vp8x(64, 64, 0x02), vp8l(64, 64)]), "animated", "animated WebP flag");
expectError(riff([webpChunk("ANIM", Buffer.alloc(6)), vp8l(64, 64)]), "animated", "WebP ANIM chunk");
expectError(png(4097, 100), "dimensions_too_large", "PNG wider than 4096");
expectError(riff([vp8x(4096, 4097, 0)]), "dimensions_too_large", "WebP taller than 4096");
expectError(Buffer.alloc(MAX_INPUT_BYTES + 1), "too_large", "file over 20MiB");

// The built package never reaches image generation, a chat-bound image store or a localhost URL, and asks only for
// the permissions P0 needs.
{
  const root = join(__dirname, "../packages/forest-workshop");
  const [server, client, manifestText] = ["server.mjs", "client.js", "manifest.json"].map((file) =>
    readFileSync(join(root, file), "utf8"),
  );
  for (const [name, bundle] of [
    ["server.mjs", server],
    ["client.js", client],
  ] as const) {
    for (const forbidden of [
      "avatar-generation",
      "images.save",
      "images.stage",
      "localhost",
      "127.0.0.1",
      "/api/chats",
    ]) {
      assert.ok(!bundle.includes(forbidden), `${name} must not reference ${forbidden}`);
    }
  }
  const manifest = JSON.parse(manifestText) as { permissions: string[]; contributions: { slots: string[] } };
  assert.deepEqual(manifest.permissions, ["routes", "storage", "ui"]);
  assert.deepEqual(manifest.contributions.slots, ["home-browser-tab"]);
  assert.ok(server.includes("/api/global-gallery/upload"), "the gallery upload is the only stored-image path");
}

console.log("forest-workshop P0 regressions: OK");
