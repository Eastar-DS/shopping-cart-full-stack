import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export interface CheckoutState {
  kindsCount: number;
  totalQuantity: number;
  total: number;
}

export function CheckoutPage() {
  const { state } = useLocation() as { state: CheckoutState | null };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div>
      <h1>주문 확인</h1>
      <p>
        총 {state.kindsCount}종류의 상품 {state.totalQuantity}개를 주문합니다.
      </p>
      <p>최종 결제 금액: {state.total.toLocaleString()}원</p>
      {/* TODO: 디자인 정본 + 결제하기 버튼 — Step 31 */}
    </div>
  );
}
