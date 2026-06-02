import { http, HttpResponse } from "msw";
import { server } from "../../../../test/mocks/server";
import { getCart } from "./cart";
import { ApiError } from "../../../shared/api/httpClient";

describe("getCart", () => {
  test("정상 응답 시 카트 항목 배열을 반환한다", async () => {
    const result = await getCart();

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      id: "1",
      product: expect.objectContaining({ name: "EASTER" }),
    });
  });

  test("서버 500 응답 시 ApiError 를 throw 한다", async () => {
    server.use(
      http.get("http://localhost:3000/carts", () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "boom" },
          { status: 500 },
        ),
      ),
    );

    await getCart().catch((e) => {
      expect(e).toBeInstanceOf(ApiError);
      expect(e.code).toBe("InternalServerError");
      expect(e.status).toBe(500);
    });
  });
});
