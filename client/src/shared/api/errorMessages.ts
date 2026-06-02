import { ApiError } from "./httpClient";

const message: Record<string, string> = {
  InvalidInputError: "잘못된 요청입니다. 입력값을 확인해주세요.",
  NotFoundError: "요청하신 항목을 찾을 수 없습니다.",
  DuplicateNameError: "이미 사용 중인 이름입니다.",
  InternalServerError:
    "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

const FALLBACK = "알 수 없는 오류가 발생했습니다.";

export const toUserMessage = (error: unknown): string => {
  if (error instanceof ApiError && message[error.code]) {
    return message[error.code];
  }
  if (error instanceof Error) {
    return FALLBACK;
  }
  return FALLBACK;
};
