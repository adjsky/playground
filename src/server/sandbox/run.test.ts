import run from "./run"

describe("functionality", () => {
  it("works", async () => {
    const result1 = await run("javascript", "console.log('asdasd')")
    expect(result1).toBe("asdasd\n")

    const result2 = await run("typescript", "console.log('asdasd')")
    expect(result2).toBe("asdasd\n")
  })
})
