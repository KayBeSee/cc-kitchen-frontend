import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import BigNumber from 'bignumber.js';

import { offWhite, black, gray } from './utils/colors';

import { Sidebar } from './components';

import { getTransactionsFromMultisig } from './utils/transactions';

// Pages
import Login from './pages/Login';
import GDriveImport from './pages/GDriveImport';
import Setup from './pages/Setup';
import Spend from './pages/Spend';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Vault from './pages/Vault';
import Transfer from './pages/Transfer';
import Receive from './pages/Receive';
import Send from './pages/Send';
import ColdcardImportInstructions from './pages/ColdcardImportInstructions';

// Other display components
// import Header from './components/Nav/Header';
// import Footer from './components/footer';

function App() {
  const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState(BigNumber(0));
  // const [caravanFile, setCaravanFile] = useState();
  const [caravanFile, setCaravanFile] = useState({ "name": "Coldcard Kitchen", "addressType": "P2WSH", "network": "testnet", "client": { "type": "public" }, "quorum": { "requiredSigners": 2, "totalSigners": 3 }, "extendedPublicKeys": [{ "name": "34ecf56b", "bip32Path": "m/0", "xpub": "tpubDECB21DPAjBvUtqSCGWHJrbh6nSg9JojqmoMBuS5jGKTFvYJb784Pu5hwq8vSpH6vkk3dZmjA3yR7mGbrs3antkL6BHVHAyjPeeJyAiVARA", "method": "xpub" }, { "name": "9130c3d6", "bip32Path": "m/0", "xpub": "tpubDDv6Az73JkvvPQPFdytkRrizpdxWtHTE6gHywCRqPu3nz2YdHDG5AnbzkJWJhtYwEJDR3eENpQQZyUxtFFRRC2K1PEGdwGZJYuji8QcaX4Z", "method": "xpub" }, { "name": "4f60d1c9", "bip32Path": "m/0", "xpub": "tpubDFR1fvmcdWbMMDn6ttHPgHi2Jt92UkcBmzZ8MX6QuoupcDhY7qoKsjSG2MFvN66r2zQbZrdjfS6XtTv8BjED11hUMq3kW2rc3CLTjBZWWFb", "method": "xpub" }] });


  // WALLET DATA
  const [transactions, setTransactions] = useState([]);
  const [unusedAddresses, setUnusedAddresses] = useState([]);
  const [unusedChangeAddresses, setUnusedChangeAddresses] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(BigNumber(0));
  const [availableUtxos, setAvailableUtxos] = useState([]);
  const [loadingDataFromBlockstream, setLoadingDataFromBlockstream] = useState(false);

  const ConfigRequired = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    if (!caravanFile && (pathname !== '/login' && pathname !== '/gdrive-import' && pathname !== '/setup')) {
      history.push('login');
      window.location.reload();
    }
    return null;
  }

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  useEffect(() => {
    async function fetchCurrentBitcoinPrice() {
      const currentBitcoinPrice = await (await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')).data.bpi.USD.rate;
      setCurrentBitcoinPrice(new BigNumber(currentBitcoinPrice.replace(',', '')));
    }
    fetchCurrentBitcoinPrice();
  }, []);

  useEffect(() => {
    if (caravanFile) {
      setLoadingDataFromBlockstream(true);
      async function fetchTransactionsFromBlockstream() {
        const [transactions, unusedAddresses, unusedChangeAddresses, availableUtxos] = await getTransactionsFromMultisig(caravanFile);

        const currentBalance = availableUtxos.reduce((accum, utxo) => accum.plus(utxo.value), BigNumber(0));

        setAvailableUtxos(availableUtxos);
        setUnusedAddresses(unusedAddresses);
        setTransactions(transactions);
        setCurrentBalance(currentBalance);
        setUnusedChangeAddresses(unusedChangeAddresses);
        setLoadingDataFromBlockstream(false);
      }
      fetchTransactionsFromBlockstream();
    }
  }, [caravanFile]);

  return (
    <Router>
      {/* <WindowWrapper> */}
      {/* <Header /> */}
      <PageWrapper id="page-wrapper">
        <ScrollToTop />
        <ConfigRequired />
        {caravanFile && <Sidebar caravanFile={caravanFile} />}
        <Switch>
          <Route path="/vault" component={() => <Vault caravanFile={caravanFile} currentBitcoinPrice={currentBitcoinPrice} transactions={transactions} currentBalance={currentBalance} loadingDataFromBlockstream={loadingDataFromBlockstream} />} />
          <Route path="/receive" component={() => <Receive caravanFile={caravanFile} currentBitcoinPrice={currentBitcoinPrice} transactions={transactions} currentBalance={currentBalance} loadingDataFromBlockstream={loadingDataFromBlockstream} unusedAddresses={unusedAddresses} />} />
          <Route path="/send" component={() => <Send caravanFile={caravanFile} currentBitcoinPrice={currentBitcoinPrice} transactions={transactions} currentBalance={currentBalance} loadingDataFromBlockstream={loadingDataFromBlockstream} availableUtxos={availableUtxos} unusedChangeAddresses={unusedChangeAddresses} />} />
          <Route path="/setup" component={() => <Setup caravanFile={caravanFile} setCaravanFile={setCaravanFile} />} />
          <Route path="/login" component={() => <Login setCaravanFile={setCaravanFile} />} />
          <Route path="/settings" component={() => <Settings caravanFile={caravanFile} />} />
          <Route path="/transfer" component={() => <Transfer caravanFile={caravanFile} />} />
          <Route path="/gdrive-import" component={() => <GDriveImport setCaravanFile={setCaravanFile} />} />
          <Route path="/coldcard-import-instructions" component={() => <ColdcardImportInstructions />} />
          <Route path="/" component={() => (
            <div>Not Found</div>
          )}
          />
        </Switch>
      </PageWrapper>
      <FooterWrapper>
        <ViewSourceCodeText href="https://github.com/KayBeSee/cc-kitchen-frontend" target="_blank">View Source Code</ViewSourceCodeText>
        <DontTrustVerify>Don't Trust. Verify.</DontTrustVerify>
      </FooterWrapper>
      {/* <Footer /> */}
      {/* </WindowWrapper> */}
    </Router>
  );
}

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  background: ${offWhite};
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${offWhite};
  flex: 1 0;
  padding: 1.5em;
`;

const ViewSourceCodeText = styled.a`
  color: ${ black};
  text-decoration: none;
  cursor: pointer;
  letter-spacing: -0.03em;
  font-family: 'Raleway', sans-serif;
`;

const DontTrustVerify = styled.span`
color: ${ gray};
`;

export default App;
