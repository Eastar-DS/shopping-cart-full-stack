import styled from "@emotion/styled";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BackIcon } from "../../assets/icons/BackIcon";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCheckoutPage = location.pathname === "/checkout";

  return (
    <HeaderBar>
      {isCheckoutPage ? (
        <BackButton
          type="button"
          onClick={() => navigate(-1)}
          aria-label="이전 페이지로"
        >
          <BackIcon width={32} height={32} />
        </BackButton>
      ) : (
        <Logo to="/">SHOP</Logo>
      )}
    </HeaderBar>
  );
}

const HeaderBar = styled.header`
  background: #000000;
  color: #ffffff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  height: 64px;
  box-sizing: border-box;
`;

const Logo = styled(Link)`
  font-family: "Noto Sans", sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: #ffffff;
  text-decoration: none;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit; /* HeaderBar 의 흰색 상속 → BackIcon 자동 흰 */
  display: grid;
  place-items: center;
`;
