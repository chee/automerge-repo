import assert from "assert"
import { describe, it } from "vitest"
import {
  generateAutomergeUrl,
  isValidAutomergeUrl,
  parseAutomergeUrl,
  stringifyAutomergeUrl,
} from "../src/DocUrl.js"
import type {
  AutomergeUrl,
  BinaryDocumentId,
  DocumentId,
} from "../src/types.js"

const goodUrl = "automerge:4NMNnkMhL8jXrdJ9jamS58PAVdXu" as AutomergeUrl
const badChecksumUrl = "automerge:badbadbad" as AutomergeUrl
const badPrefixUrl = "yjs😉:4NMNnkMhL8jXrdJ9jamS58PAVdXu" as AutomergeUrl

const goodDocumentId = "4NMNnkMhL8jXrdJ9jamS58PAVdXu" as DocumentId
const badDocumentId = "badbadbad" as DocumentId

const goodBinaryDocumentId = Uint8Array.from([
  241, 194, 156, 132, 116, 200, 74, 222, 184, 0, 190, 71, 98, 125, 51, 191,
]) as BinaryDocumentId

describe("AutomergeUrl", () => {
  describe("generateAutomergeUrl", () => {
    it("should generate a valid Automerge URL", () => {
      const url = generateAutomergeUrl()
      assert(url.startsWith("automerge:"))
      assert(parseAutomergeUrl(url).binaryDocumentId)
    })
  })

  describe("stringifyAutomergeUrl", () => {
    it("should stringify a binary document ID", () => {
      const url = stringifyAutomergeUrl({ documentId: goodBinaryDocumentId })
      assert.strictEqual(url, goodUrl)
    })

    it("should stringify a string document ID", () => {
      const url = stringifyAutomergeUrl({ documentId: goodDocumentId })
      assert.strictEqual(url, goodUrl)
    })
  })

  describe("parseAutomergeUrl", () => {
    it("should parse a valid url", () => {
      const { binaryDocumentId, documentId } = parseAutomergeUrl(goodUrl)
      assert.deepEqual(binaryDocumentId, goodBinaryDocumentId)
      assert.equal(documentId, goodDocumentId)
    })

    it("should throw on url with invalid checksum", () => {
      assert.throws(() => parseAutomergeUrl(badChecksumUrl))
    })

    it("should throw on url with invalid prefix", () => {
      assert.throws(() => parseAutomergeUrl(badPrefixUrl))
    })
  })

  describe("isValidAutomergeUrl", () => {
    it("should return true for a valid url", () => {
      assert(isValidAutomergeUrl(goodUrl) === true)
    })

    it("should return false for a url with invalid checksum", () => {
      assert(isValidAutomergeUrl(badChecksumUrl) === false)
    })

    it("should return false for a url with invalid prefix", () => {
      assert(isValidAutomergeUrl(badPrefixUrl) === false)
    })

    it("should return false for a url created from an invalid documentId", () => {
      const url = stringifyAutomergeUrl({ documentId: badDocumentId })
      assert(isValidAutomergeUrl(url) === false)
    })
  })
})
