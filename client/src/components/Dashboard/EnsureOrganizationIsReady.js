import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { compose } from 'utils';
import withAuthentication from 'containers/Authentication/withAuthentication';
import withOrganizationByOrgId from 'containers/Organization/withOrganizationByOrgId';

function EnsureOrganizationIsReady({
  // #ownProps
  children,
  redirectTo = '/setup',

  // #withOrganizationByOrgId
  organization,
}) {
  return (organization.is_ready) ? children : (
    <Redirect
      to={{ pathname: redirectTo }}
    />
  );
}

export default compose(
  withAuthentication(),
  connect((state, props) => ({
    organizationId: props.currentOrganizationId,
  })),
  withOrganizationByOrgId(),
)(EnsureOrganizationIsReady);