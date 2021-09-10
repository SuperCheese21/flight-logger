import React from 'react';

import { Navbar, PageContainer, PageContent, Router } from './components';

function App() {
  return (
    <PageContainer>
      <Navbar />
      <PageContent>
        <Router />
      </PageContent>
    </PageContainer>
  );
}

export default App;
