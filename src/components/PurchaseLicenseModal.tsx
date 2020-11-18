import React, { Fragment } from 'react';
import styled from 'styled-components';

import { Button, Modal, PricingPlanTable } from '.';

import { white, gray300, gray400, gray900, green700 } from '../utils/colors';

interface Props {
  isOpen: boolean
  onRequestClose: () => void
}

export const PurchaseLicenseModal = ({
  isOpen,
  onRequestClose
}: Props) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Fragment>
        <ModalHeader>
          <HeaderText>Pricing Plans</HeaderText>
        </ModalHeader>
        <InputsWrapper>
          <PricingPlanTable />
          <Buttons>
            <RenewButton
              style={{ border: `1px solid ${gray400}`, marginRight: '1em' }}
              color={gray900}
              background={white}>
              Questions? Call (970) 425-0282
          </RenewButton>
          </Buttons>
        </InputsWrapper>
      </Fragment>
    </Modal >
  )
}

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RenewButton = styled.button`
  ${Button};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const ModalHeader = styled.div`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: -.5rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${gray300};
  background: ${green700};
`;

const HeaderText = styled.div`
  margin-top: .5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: ${white};
`;

const InputsWrapper = styled.div`
  padding: 1em 2em 2em;
`;