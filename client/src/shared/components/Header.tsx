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
          <BackIcon width={25} height={23} />
        </BackButton>
      ) : (
        <Logo to="/">SHOP</Logo>
      )}
    </HeaderBar>
  );
}

const HeaderBar = styled.header`
  max-width: 480px;
  margin: 0 auto;
  background: #000000;
  color: #ffffff;
  height: 64px;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
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
  color: inherit;
  display: grid;
  place-items: center;
`;
