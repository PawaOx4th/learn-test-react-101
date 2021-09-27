import React from "react"
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import App from "./App"
import userEvent from "@testing-library/user-event"
import { getHeroDetail } from "./api"

jest.mock("./api")

const RESPONSE = {
  id: 1,
  name: "Superman",
  avatar:
    "https://cdn.theatlantic.com/thumbor/xuePShEYRyEQec_THgWcYFhYLnw=/540x0:2340x1800/500x500/media/img/mt/2016/01/superman/original.jpg",
  description:
    "Superman is a fictional superhero. The character was created by writer Jerry Siegel and artist Joe Shunter, and first appeared in the comic book Action Comics #1 (cover-dated June 1938 and published April 18, 1938).[1] The character regularly appears in comic books published by DC Comics, and has been adapted to a number of radio serials, movies, and television shows.",
}

const myGetHeroDetail = getHeroDetail as jest.MockedFunction<
  typeof getHeroDetail
>

myGetHeroDetail.mockResolvedValue(RESPONSE)

const renderApp = () => {
  render(<App />)
  const getInputEle = () => screen.getByLabelText(/search/i)
  const getSubmitBtnEle = () => screen.getByRole("button", { name: /submit/i })
  return {
    getInputEle,
    getSubmitBtnEle,
    runSearch: async (name: string, callBack?: () => void) => {
      userEvent.type(getInputEle(), name)
      userEvent.click(getSubmitBtnEle())
      if (callBack) callBack()
      await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
    },
  }
}

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should display input and button element", () => {
    const { getInputEle, getSubmitBtnEle } = renderApp()
    getInputEle()
    getSubmitBtnEle()
  })

  it("should call  getHeroDetail with submitted", async () => {
    const { runSearch } = renderApp()

    await runSearch("superman")

    expect(getHeroDetail).toHaveBeenCalledWith("superman")
  })

  it("Should render loading by calling API", async () => {
    const { runSearch } = renderApp()

    await runSearch("superman", () => {
      screen.getByText(/loading/i)
    })
    expect(myGetHeroDetail).toHaveBeenCalledWith("superman")
  })

  it("Should render response show avatar name and description", async () => {
    const { runSearch } = renderApp()
    await runSearch("superman", () => {
      screen.getByText(/loading/i)
    })
    screen.getByText(RESPONSE.name)
  })
})
