import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';
import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import ExpenseViewTabs from 'containers/Expenses/ExpenseViewTabs';
import ExpenseDataTable from 'containers/Expenses/ExpenseDataTable';
import ExpenseActionsBar from 'containers/Expenses/ExpenseActionsBar';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withExpensesActions from 'containers/Expenses/withExpensesActions';
import withViewsActions from 'containers/Views/withViewsActions';

import { compose } from 'utils';

function ExpensesList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions
  requestFetchResourceViews,

  //#withExpensesActions
  requestFetchExpensesTable,
  requestDeleteExpense,
  requestPublishExpense,
  requestDeleteBulkExpenses,
  addExpensesTableQueries,
  requestFetchExpense,
}) {
  const history = useHistory();
  const { id } = useParams();
  const { formatMessage } = useIntl();

  const [deleteExpense, setDeleteExpense] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(false);

  const fetchViews = useQuery('expenses-resource-views', () => {
    return requestFetchResourceViews('expenses');
  });

  const fetchExpenses = useQuery('expenses-table', () =>
    requestFetchExpensesTable(),
  );

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'expenses_list' }));
  }, [changePageTitle, formatMessage]);

  // Handle delete expense click.

  const handleDeleteExpense = useCallback(
    (expnese) => {
      setDeleteExpense(expnese);
    },
    [setDeleteExpense],
  );

  // Handle cancel expense journal.
  const handleCancelExpenseDelete = useCallback(() => {
    setDeleteExpense(false);
  }, [setDeleteExpense]);

  // Handle confirm delete expense.
  const handleConfirmExpenseDelete = useCallback(() => {
    requestDeleteExpense(deleteExpense.id).then(() => {
      AppToaster.show({
        message: formatMessage(
          {
            id: 'the_expense_has_been_successfully_deleted',
          },
          {
            number: deleteExpense.payment_account_id,
          },
        ),
        intent: Intent.SUCCESS,
      });
      setDeleteExpense(false);
    });
  }, [deleteExpense, requestDeleteExpense, formatMessage]);

  // Calculates the selected rows count.
  const selectedRowsCount = useMemo(() => Object.values(selectedRows).length, [
    selectedRows,
  ]);

  const handleBulkDelete = useCallback(
    (accountsIds) => {
      setBulkDelete(accountsIds);
    },
    [setBulkDelete],
  );

  // Handle confirm journals bulk delete.
  const handleConfirmBulkDelete = useCallback(() => {
    requestDeleteBulkExpenses(bulkDelete)
      .then(() => {
        AppToaster.show({
          message: formatMessage(
            { id: 'the_expenses_has_been_successfully_deleted', },
            { count: selectedRowsCount, },
          ),
          intent: Intent.SUCCESS,
        });
        setBulkDelete(false);
      })
      .catch((error) => {
        setBulkDelete(false);
      });
  
      // @todo 
  }, [requestDeleteBulkExpenses, bulkDelete, formatMessage, selectedRowsCount]);

  // Handle cancel bulk delete alert.
  const handleCancelBulkDelete = useCallback(() => {
    setBulkDelete(false);
  }, []);

  const handleEidtExpense = useCallback(
    (expense) => {
      history.push(`/expenses/${expense.id}/edit`);
    },
    [history],
  );

  // Handle filter change to re-fetch data-table.
  const handleFilterChanged = useCallback(() => {}, []);

  // Handle fetch data of manual jouranls datatable.
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addExpensesTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
    },
    [addExpensesTableQueries],
  );

  const handlePublishExpense = useCallback(
    (expense) => {
      requestPublishExpense(expense.id).then(() => {
        AppToaster.show({
          message: formatMessage({ id: 'the_expense_id_has_been_published' }),
        });
      });
    },
    [requestPublishExpense, formatMessage],
  );

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider
      loading={fetchViews.isFetching || fetchExpenses.isFetching}
      name={'expenses'}
    >
      <ExpenseActionsBar
        onBulkDelete={handleBulkDelete}
        selectedRows={selectedRows}
        onFilterChanged={handleFilterChanged}
      />

      <DashboardPageContent>
        <Switch>
          <Route
            // exact={true}
            // path={[
            //   '/expenses/:custom_view_id/custom_view',
            //   '/expenses/new',
            // ]}
          >
            <ExpenseViewTabs />

            <ExpenseDataTable
              onDeleteExpense={handleDeleteExpense}
              onFetchData={handleFetchData}
              onEditExpense={handleEidtExpense}
              onPublishExpense={handlePublishExpense}
              onSelectedRowsChange={handleSelectedRowsChange}
            />
          </Route>
        </Switch>

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'delete'} />}
          icon="trash"
          intent={Intent.DANGER}
          isOpen={deleteExpense}
          onCancel={handleCancelExpenseDelete}
          onConfirm={handleConfirmExpenseDelete}
        >
          <p>
            <T id={'once_delete_this_expense_you_will_able_to_restore_it'} />
          </p>
        </Alert>

        {/* <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={
            <T id={'delete_count'} values={{ count: selectedRowsCount }} />
          }
          icon="trash"
          intent={Intent.DANGER}
          isOpen={bulkDelete}
          onCancel={handleCancelBulkDelete}
          onConfirm={handleConfirmBulkDelete}
        >
          <p>
            <T
              id={'once_delete_these_journalss_you_will_not_able_restore_them'}
            />
          </p>
        </Alert> */}
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withExpensesActions,
  withViewsActions,
)(ExpensesList);
