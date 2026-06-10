import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { server } from "../../../../test/mocks/server";
import { queryStore } from "../../../shared/queries";
import { CartPage } from "./CartPage";

const baseUrl = "http://localhost:3000";

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
}

let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
  localStorage.clear();
  queryStore.reset();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("CartPage", () => {
  it("카트가 비어있으면 EmptyCart 안내가 표시된다", async () => {
    server.use(http.get(`${baseUrl}/carts`, () => HttpResponse.json([])));

    renderCartPage();

    expect(
      await screen.findByText(/장바구니에 담은 상품이 없습니다/),
    ).toBeInTheDocument();
  });

  it("API 가 실패하면 ErrorFallback 의 재시도 버튼이 노출되고, 클릭 시 다시 요청한다", async () => {
    let calls = 0;
    server.use(
      http.get(`${baseUrl}/carts`, () => {
        calls += 1;
        if (calls === 1) {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json([]);
      }),
    );

    renderCartPage();

    const retryButton = await screen.findByRole("button", {
      name: /다시 시도/,
    });

    await userEvent.click(retryButton);

    expect(
      await screen.findByText(/장바구니에 담은 상품이 없습니다/),
    ).toBeInTheDocument();
    expect(calls).toBe(2);
  });
});
