// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { defaultTo } from 'lodash';

import {
  CustomerDrawerLink,
  CommercialDocHeader,
  CommercialDocTopHeader,
  ExchangeRateDetailItem,
  Row,
  Col,
  DetailsMenu,
  DetailItem,
} from '@/components';

import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import { ReceiptDetailsStatus } from './components';

/**
 * Receipt details header.
 */
export default function ReceiptDetailHeader() {
  const { receipt } = useReceiptDetailDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountReceiptItem label={intl.get('amount')}>
            <h3 class="big-number">{receipt.total_formatted}</h3>
          </AmountReceiptItem>

          <StatusReceiptItem>
            <ReceiptDetailsStatus receipt={receipt} />
          </StatusReceiptItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('receipt.details.receipt_number')}
              children={defaultTo(receipt.receipt_number, '-')}
            />
            <DetailItem label={intl.get('customer_name')}>
              <CustomerDrawerLink customerId={receipt.customer_id}>
                {receipt.customer?.display_name}
              </CustomerDrawerLink>
            </DetailItem>
            <DetailItem
              label={intl.get('receipt_date')}
              children={receipt.formatted_receipt_date}
            />
            <DetailItem
              label={intl.get('closed_date')}
              children={receipt.formatted_closed_at_date}
            />
            <ExchangeRateDetailItem
              exchangeRate={receipt?.exchange_rate}
              toCurrency={receipt?.currency_code}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            direction={'horizantal'}
            minLabelSize={'180px'}
            textAlign={'right'}
          >
            <DetailItem
              label={intl.get('deposit_account')}
              children={receipt.deposit_account?.name}
            />
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(receipt.reference_no, '--')}
            />
            <DetailItem
              label={intl.get('receipt.details.created_at')}
              children={receipt.formatted_created_at}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const AmountReceiptItem = styled(DetailItem)`
  width: 50%;
`;

const StatusReceiptItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
`;
