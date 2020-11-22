import React, { useState, Fragment } from 'react'
import styled, { css } from 'styled-components';
import { mobile } from '../utils/media';
import { Circle } from '@styled-icons/boxicons-solid';
import { Menu } from '@styled-icons/boxicons-regular';
import BigNumber from 'bignumber.js';

import { white, green400, orange400, red500, green800, green900 } from '../utils/colors';

import { ConnectToNodeModal, StyledIcon, Dropdown, ConnectToLilyMobileModal, LicenseModal } from '.';

import { NodeConfig, LilyConfig } from '../types';

interface Props {
  setNodeConfig: React.Dispatch<React.SetStateAction<NodeConfig | undefined>>, // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  nodeConfig: NodeConfig | undefined // KBC-TODO: NodeConfig should be defined, even if we are connected to blockstream, yeah? No?
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>,
  config: LilyConfig,
  connectToBlockstream: () => void,
  connectToBitcoinCore: () => void,
  getNodeConfig: () => void,
  resetConfigFile: () => void,
  setPurchaseLicenseModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const TitleBar = ({
  setNodeConfig,
  nodeConfig,
  setMobileNavOpen,
  config,
  connectToBlockstream,
  connectToBitcoinCore,
  getNodeConfig,
  resetConfigFile,
  setPurchaseLicenseModalOpen
}: Props) => {
  const [nodeConfigModalOpen, setNodeConfigModalOpen] = useState(false);
  const [moreOptionsDropdownOpen, setMoreOptionsDropdownOpen] = useState(false);
  const [nodeOptionsDropdownOpen, setNodeOptionsDropdownOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);

  const refreshNodeData = async () => {
    await getNodeConfig();
  }

  const nodeConfigDropdownItems = [];

  nodeConfigDropdownItems.push({
    label: (
      <Fragment>
        Status: <br />
        {nodeConfig && nodeConfig.initialblockdownload && nodeConfig.verificationprogress ? `Initializing (${new BigNumber(nodeConfig.verificationprogress).multipliedBy(100).toFixed(2)}%)`
          : nodeConfig && nodeConfig.connected ? `Connected via ${nodeConfig.provider}`
            : nodeConfig && !nodeConfig.connected ? `Disconnected from ${nodeConfig.provider}`
              : 'Connecting...'}
      </Fragment>
    )
  });

  nodeConfigDropdownItems.push({})

  if (nodeConfig && nodeConfig.blocks) {
    nodeConfigDropdownItems.push({ label: `Block Height: ${nodeConfig ? nodeConfig.blocks.toLocaleString() : 'Connecting...'}` });
  }

  nodeConfigDropdownItems.push({ label: 'Refresh Node Info', onClick: () => { refreshNodeData() } });
  nodeConfigDropdownItems.push({})

  if (nodeConfig && nodeConfig.provider !== 'Bitcoin Core') {
    nodeConfigDropdownItems.push({ label: 'Connect to Bitcoin Core', onClick: async () => await connectToBitcoinCore() })
  }
  if (nodeConfig && nodeConfig.provider !== 'Blockstream') {
    nodeConfigDropdownItems.push({ label: 'Connect to Blockstream', onClick: async () => await connectToBlockstream() })
  }
  nodeConfigDropdownItems.push({ label: 'Connect to Custom Node', onClick: () => setNodeConfigModalOpen(true) })

  const moreOptionsDropdownItems = [
    { label: 'Support', onClick: () => { console.log('foobar') } },
    { label: 'License', onClick: () => { setLicenseModalOpen(true) } },
    { label: 'Purchase License', onClick: () => { setPurchaseLicenseModalOpen(true) } },
    { label: 'View source code', onClick: () => { console.log('foobar2') } }
  ];

  if (!config.isEmpty) {
    moreOptionsDropdownItems.push(
      { label: 'Connect to Lily Mobile', onClick: () => { setConfigModalOpen(true) } },
      { label: 'Sign out', onClick: async () => { await resetConfigFile() } }
    )
  }

  return (
    <DraggableTitleBar>
      <ConnectToNodeModal
        isOpen={nodeConfigModalOpen}
        onRequestClose={() => setNodeConfigModalOpen(false)}
        setNodeConfig={setNodeConfig}
      />
      <ConnectToLilyMobileModal
        isOpen={configModalOpen}
        onRequestClose={() => setConfigModalOpen(false)}
        config={config}
      />
      <LicenseModal
        config={config}
        isOpen={licenseModalOpen}
        nodeConfig={nodeConfig!}
        onRequestClose={() => setLicenseModalOpen(false)}
      />
      <LeftSection>
        {!config.isEmpty && (
          <MobileMenuOpen onClick={() => setMobileNavOpen(true)} >
            <StyledIcon as={Menu} size={36} /> Menu
          </MobileMenuOpen>
        )}
      </LeftSection>
      <RightSection>
        <NodeButtonContainer>
          <Dropdown
            isOpen={nodeOptionsDropdownOpen}
            setIsOpen={setNodeOptionsDropdownOpen}
            minimal={false}
            style={{ background: green900, color: white, padding: '0.35em 1em', border: 'none', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center' }}
            buttonLabel={
              <Fragment>
                {nodeConfig ? (
                  <StyledIcon as={Circle} style={{
                    color: (nodeConfig.initialblockdownload) ? orange400
                      : (nodeConfig.connected) ? green400
                        : red500, // !nodeConfig.connected
                    // marginRight: '.5em'
                  }} />
                ) : (
                    <LoadingImage alt="loading placeholder" src={require('../assets/flower-loading.svg')} />
                  )}
                {nodeConfig && nodeConfig.connected ? null
                  : nodeConfig && !nodeConfig.connected ? null
                    : 'Connecting...'}
              </Fragment>
            }
            dropdownItems={nodeConfigDropdownItems}
          />
        </NodeButtonContainer>

        <DotDotDotContainer>
          <Dropdown
            style={{ color: white }}
            isOpen={moreOptionsDropdownOpen}
            setIsOpen={setMoreOptionsDropdownOpen}
            minimal={true}
            dropdownItems={moreOptionsDropdownItems}
          />
        </DotDotDotContainer>
      </RightSection>
    </DraggableTitleBar >
  )

}

const LoadingImage = styled.img`
  filter: brightness(0) invert(1);
  max-width: 1.25em;
  margin-right: .25em;
  opacity: 0.9;
`;

const LeftSection = styled.div`
  display: flex;
  margin-left: 1em;
`;
const RightSection = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const MobileMenuOpen = styled.div`
  display: none;
  color: ${white};
  cursor: pointer;
  margin-left: 3.5em;
  align-items: center;
  ${mobile(css`
    display: flex;
  `)}

`;

const DotDotDotContainer = styled.div`
  margin: 0 1em 0 0;
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
`;

const DraggableTitleBar = styled.div`
  position: fixed;
  background: ${green800};
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: 2.5rem;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, sans-serif;
`;

const NodeButtonContainer = styled.div`
  margin: 0 0.25em;
  -webkit-app-region: no-drag;
`;