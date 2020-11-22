import React, { useState, Fragment, useContext } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { VerticalAlignBottom, ArrowUpward, Settings, Refresh } from '@styled-icons/material';
import { Network } from 'bitcoinjs-lib';

import { AccountMapContext } from '../../AccountMapContext';

import { StyledIcon, Button, PageWrapper, PageTitle, Header, HeaderRight, HeaderLeft } from '../../components';

import VaultView from './VaultView';
import AddressesView from './AddressesView';
import UtxosView from './UtxosView';
import VaultSettings from './VaultSettings';

import { white, gray300, green900 } from '../../utils/colors';

import { LilyConfig } from '../../types'

interface Props {
  config: LilyConfig
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>,
  password: string
  toggleRefresh(): void,
  currentBitcoinNetwork: Network
}

const Vault = ({ config, setConfigFile, password, toggleRefresh, currentBitcoinNetwork }: Props) => {
  document.title = `Vault - Lily Wallet`;
  const [viewSettings, setViewSettings] = useState(false);
  const [viewAddresses, setViewAddresses] = useState(false);
  const [viewUtxos, setViewUtxos] = useState(false);

  const { currentAccount } = useContext(AccountMapContext);

  const toggleViewSettings = () => {
    setViewSettings(!viewSettings);
    setViewAddresses(false);
    setViewUtxos(false);
  }

  return (
    <PageWrapper>
      <Fragment>

        <Header>
          <HeaderLeft>
            <PageTitle>{currentAccount.name}</PageTitle>
            <VaultExplainerText>
              {currentAccount.config.quorum.totalSigners > 1 && (
                <Fragment>
                  <IconSvg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path></IconSvg>
                  {currentAccount.config.quorum.requiredSigners} of {currentAccount.config.quorum.totalSigners} Multisignature Vault
                </Fragment>
              )}
              {currentAccount.config.quorum.totalSigners === 1 && currentAccount.config.mnemonic && (
                <Fragment>
                  <IconSvg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"></path></IconSvg>
                  <span>
                    Hot Wallet
              </span>
                </Fragment>
              )}
              {currentAccount.config.quorum.totalSigners === 1 && currentAccount.config.device && (
                <Fragment>
                  <IconSvg viewBox="0 0 20 20" fill="currentColor" className="calculator w-6 h-6"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd"></path></IconSvg>
                  <span>
                    Hardware Wallet
              </span>
                </Fragment>
              )}
            </VaultExplainerText>
          </HeaderLeft>
          <HeaderRight>
            <SendButton to="/send" color={white} background={green900}><StyledIcon as={ArrowUpward} size={24} style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }} />Send</SendButton>
            <ReceiveButton to="/receive" color={white} background={green900}><StyledIcon as={VerticalAlignBottom} size={24} style={{ marginRight: '.5rem', marginLeft: '-0.25rem' }} />Receive</ReceiveButton>
            <SettingsButton
              onClick={() => toggleRefresh()}
              color={white}
              style={{ padding: '1em 1em 1em 0' }}
              background={'transparent'}>
              <StyledIcon as={Refresh} size={36} />
            </SettingsButton>
            <SettingsButton
              onClick={() => toggleViewSettings()}
              // active={viewSettings} // KBC-TODO: reimplement active on SettingsButton
              color={white}
              background={'transparent'}
              style={{ padding: 0 }}
            >
              <StyledIcon as={Settings} size={36} />
            </SettingsButton>
          </HeaderRight>
        </Header>

        {(viewSettings && viewAddresses) ? (
          <AddressesView
            setViewAddresses={setViewAddresses}
            currentAccount={currentAccount}
            toggleViewSettings={toggleViewSettings}
          />
        ) : (viewSettings && viewUtxos) ? (
          <UtxosView
            setViewUtxos={setViewUtxos}
            currentAccount={currentAccount}
            toggleViewSettings={toggleViewSettings}
          />
        ) : viewSettings ? (
          <VaultSettings
            config={config}
            setConfigFile={setConfigFile}
            currentAccount={currentAccount}
            setViewAddresses={setViewAddresses}
            setViewUtxos={setViewUtxos}
            currentBitcoinNetwork={currentBitcoinNetwork}
            password={password}
            toggleViewSettings={toggleViewSettings}
          />
        ) : (
                <VaultView
                  currentAccount={currentAccount}
                />
              )}
      </Fragment>
    </PageWrapper>
  )
}

const IconSvg = styled.svg`
  color: ${gray300};
  width: 1.25rem;
  margin-right: .375rem;
  height: 1.25rem;
  flex-shrink: 0;
`;

const SendButton = styled(Link)`
  ${Button}
  margin: 12px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
`;

const ReceiveButton = styled(Link)`
  ${Button}
  margin: 12px;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
`;

// KBC-TODO: reimplement background on SettingsButton
// background: ${p => p.active ? gray100 : 'transparent'};
const SettingsButton = styled.button`
  ${Button}
  border-radius: 25%;
`;

const VaultExplainerText = styled.div`
  color: ${gray300};
  font-size: .75em;
  display: flex;
  align-items: center;
  font-size: 1em;
    margin-top: .5em;
`;

export default Vault;