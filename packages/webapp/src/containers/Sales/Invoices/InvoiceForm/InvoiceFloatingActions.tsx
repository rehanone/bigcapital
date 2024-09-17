// @ts-nocheck
import React, { useMemo } from 'react';
import {
  Intent,
  Button,
  ButtonGroup,
  Popover,
  PopoverInteractionKind,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { CLASSES } from '@/constants/classes';
import { If, Icon, FormattedMessage as T, Group, FSelect } from '@/components';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { useInvoiceFormBrandingTemplatesOptions } from './utils';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';

/**
 * Invoice floating actions bar.
 */
export default function InvoiceFloatingActions() {
  const history = useHistory();

  // Formik context.
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Invoice form context.
  const { setSubmitPayload, invoice } = useInvoiceFormContext();

  // Handle submit & deliver button click.
  const handleSubmitDeliverBtnClick = (event) => {
    setSubmitPayload({ redirect: true, deliver: true });
    submitForm();
  };

  // Handle submit, deliver & new button click.
  const handleSubmitDeliverAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: true, resetForm: true });
    submitForm();
  };

  // Handle submit, deliver & continue editing button click.
  const handleSubmitDeliverContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: true });
    submitForm();
  };

  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, deliver: false });
    submitForm();
  };

  // Handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: false });
    submitForm();
  };

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  // Handle clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  const brandingTemplatesOptions = useInvoiceFormBrandingTemplatesOptions();

  return (
    <Group
      spacing={10}
      className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}
    >
      {/* ----------- Save And Deliver ----------- */}
      <If condition={!invoice || !invoice?.is_delivered}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitDeliverBtnClick}
            text={<T id={'save_and_deliver'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'deliver_and_new'} />}
                  onClick={handleSubmitDeliverAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'deliver_continue_editing'} />}
                  onClick={handleSubmitDeliverContinueEditingBtnClick}
                />
              </Menu>
            }
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
          >
            <Button
              disabled={isSubmitting}
              intent={Intent.PRIMARY}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
            />
          </Popover>
        </ButtonGroup>
        {/* ----------- Save As Draft ----------- */}
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            className={'ml1'}
            onClick={handleSubmitDraftBtnClick}
            text={<T id={'save_as_draft'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitDraftAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'save_continue_editing'} />}
                  onClick={handleSubmitDraftContinueEditingBtnClick}
                />
              </Menu>
            }
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
          >
            <Button
              disabled={isSubmitting}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
            />
          </Popover>
        </ButtonGroup>
      </If>
      {/* ----------- Save and New ----------- */}
      <If condition={invoice && invoice?.is_delivered}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmitDeliverBtnClick}
            style={{ minWidth: '85px' }}
            text={<T id={'save'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitDeliverAndNewBtnClick}
                />
              </Menu>
            }
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
          >
            <Button
              disabled={isSubmitting}
              intent={Intent.PRIMARY}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
            />
          </Popover>
        </ButtonGroup>
      </If>

      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={invoice ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />

      {/* ----------- Branding Template Select ----------- */}
      <BrandingThemeFormGroup
        name={'pdf_template_id'}
        label={'Branding'}
        inline
        fastField
        style={{ marginLeft: 20 }}
      >
        <FSelect
          name={'pdf_template_id'}
          items={brandingTemplatesOptions}
          input={({ activeItem, text, label, value }) => (
            <BrandingThemeSelectButton text={text || 'Brand Theme'} minimal />
          )}
          filterable={false}
          popoverProps={{ minimal: true }}
        />
      </BrandingThemeFormGroup>
    </Group>
  );
}

