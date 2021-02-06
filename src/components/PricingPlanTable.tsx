import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Check } from "@styled-icons/boxicons-regular";
import { Dash } from "@styled-icons/octicons";

import { Button, Spinner } from ".";

import {
  white,
  gray100,
  gray400,
  gray600,
  gray900,
  green400,
  green700,
} from "../utils/colors";

import { capitalize } from "../utils/other";

import { LicenseTiers, LilyAccount } from "../types";
interface Props {
  clickRenewLicense: (level: LicenseTiers, currentAccount: LilyAccount) => void;
  currentAccount: LilyAccount;
}

export const PricingPlanTable = ({
  clickRenewLicense,
  currentAccount,
}: Props) => {
  const [isLoading, setLoading] = useState("");

  const onLicenseClick = async (tier: LicenseTiers, account: LilyAccount) => {
    if (!isLoading) {
      setLoading(tier);
      try {
        await clickRenewLicense(tier, account);
        setLoading("");
      } catch (e) {
        setLoading("");
      }
    }
  };

  const PurchaseButtonRow = () => {
    return (
      <TableRow>
        <PurchaseColumn />
        {Object.values(LicenseTiers).map((tier) => (
          <PurchaseColumn>
            <PurchaseButton
              onClick={() => onLicenseClick(tier, currentAccount)}
              background={green700}
              color={white}
              disabled={!!isLoading}
            >
              {isLoading === tier ? (
                <Spinner />
              ) : tier === LicenseTiers.free ? (
                `Enroll`
              ) : (
                `Buy ${capitalize(tier)}`
              )}
            </PurchaseButton>
          </PurchaseColumn>
        ))}
      </TableRow>
    );
  };

  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow>
            <TableColumn></TableColumn>
            <TableColumn>Free</TableColumn>
            <TableColumn>Basic</TableColumn>
            <TableColumn>Essential</TableColumn>
            <TableColumn>Premium</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <BoldTableColumn>Pricing</BoldTableColumn>
            <TableColumn>
              <PriceText>$0</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
            <TableColumn>
              <PriceText>$100</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
            <TableColumn>
              <PriceText>$500</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
            <TableColumn>
              <PriceText>$1,000</PriceText>
              <PriceSubtext>/year</PriceSubtext>
            </TableColumn>
          </TableRow>
          <PurchaseButtonRow />
          <FeatureRow>
            <BoldTableColumn
              style={{ borderTop: "1px solid rgb(203, 213, 224);" }}
            >
              Features
            </BoldTableColumn>
            <TableColumn
              style={{ borderTop: "1px solid rgb(203, 213, 224);" }}
            />
            <TableColumn
              style={{ borderTop: "1px solid rgb(203, 213, 224);" }}
            />
            <TableColumn
              style={{ borderTop: "1px solid rgb(203, 213, 224);" }}
            />
            <TableColumn
              style={{ borderTop: "1px solid rgb(203, 213, 224);" }}
            />
          </FeatureRow>
          <TableRow>
            <TableColumn>Single Signature Hardware Wallets</TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>2-of-3 Multisig Vaults</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>3-of-5 Multisig Vaults</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <FeatureRow>
            <BoldTableColumn>Network</BoldTableColumn>
            <TableColumn />
            <TableColumn />
            <TableColumn />
            <TableColumn />
          </FeatureRow>
          <TableRow>
            <TableColumn>Connect to Bitcoin Core</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>Tor Support</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <FeatureRow>
            <BoldTableColumn>Support</BoldTableColumn>
            <TableColumn />
            <TableColumn />
            <TableColumn />
            <TableColumn />
          </FeatureRow>
          <TableRow>
            <TableColumn>Email Support</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>Phone / Zoom Support</TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <DashIcon />
            </TableColumn>
            <TableColumn>
              <CheckMark />
            </TableColumn>
          </TableRow>
          <PurchaseButtonRow />
        </TableBody>
      </Table>
    </Fragment>
  );
};

const PurchaseButton = styled.button<{
  disabled: boolean;
  background: string;
  color: string;
}>`
  ${Button};
  width: 100%;
  cursor: ${(p) => (p.disabled ? "wait" : "auto")};
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
  white-space: pre-wrap;
`;

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  height: 1px;
  border: none;
  background: ${white};
  border-collapse: collapse;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border: 1px solid ${gray100};
`;

const FeatureRow = styled(TableRow)`
  background: ${gray100};
  line-height: 0.25em;
`;

const TableColumn = styled.td`
  border: none;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-bottom: 1px solid ${gray400};
  border-width: thin;
`;

const PurchaseColumn = styled(TableColumn)`
  border: none;
`;

const BoldTableColumn = styled(TableColumn)`
  font-weight: 900;
`;

const CheckMark = styled(Check)`
  width: 1.5em;
  color: ${green400};
`;

const DashIcon = styled(Dash)`
  width: 1.5em;
  color: ${gray400};
`;

const PriceText = styled.span`
  color: ${gray900};
  font-weight: 800;
  font-size: 2.25rem;
  line-height: 2.5rem;
}
`;

const PriceSubtext = styled.span`
  color: ${gray600};
  line-height: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
`;
