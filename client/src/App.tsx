import styled from '@emotion/styled';
import { colors, fonts } from './shared/styles/tokens';
import { GlobalStyles } from './shared/styles/GlobalStyles';

const Page = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  background: ${colors.background};
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-family: ${fonts.pageTitle.fontFamily};
  font-weight: ${fonts.pageTitle.fontWeight};
  font-size: ${fonts.pageTitle.fontSize};
  color: ${colors.textPrimary};
  margin: 0;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <Page>
        <PageTitle>장바구니</PageTitle>
      </Page>
    </>
  );
}

export default App;
