import { toUserMessage } from "./errorMessages";
import { ApiError } from "./httpClient";

describe("toUserMessage", () => {
  test.each([
    ["InvalidInputError", "잘못된 요청"],
    ["NotFoundError", "찾을 수 없"],
    ["DuplicateNameError", "이미 사용 중"],
    ["InternalServerError", "일시적인 오류"],
  ])("%s → 매핑된 메시지를 포함한다", (code, expectedFragment) => {
    const err = new ApiError(500, code, "irrelevant");
    expect(toUserMessage(err)).toContain(expectedFragment);
  });

  test("알 수 없는 ApiError => fallback", () => {
    const err = new ApiError(418, "IAmATeapot", "short and stout");
    expect(toUserMessage(err)).toMatch(/알 수 없는/);
  });

  test("ApiError 가 아닌 일반 Error => fallback", () => {
    expect(toUserMessage(new Error("network down"))).toMatch(/알 수 없는/);
  });
});
