import React from 'react';
import {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    setupIonicReact,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import {
    Route,
    Redirect
} from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Page from './pages/Page';

import {
    DatabaseSetupPage,
    DatabaseOpenPage,
    DatabaseClosePage,
    DatabaseCopyPage,
    DatabaseDeletePage,
    ChangeEncryptionKeyPage,
    PerformMaintenancePage
} from './pages/databases';

import {
    CollectionCreatePage,
    CollectionDeletePage,
    CollectionListPage,
    CollectionChangePage,
    CollectionDefaultPage,
    ScopeListPage,
    ScopeDefaultPage,
} from './pages/collections';
import {
    EditDocumentPage,
    DeleteDocumentPage,
    GetDocumnetPage,
    SetDocumentExpirationPage,
    ChangeDocumnetPage,
    CreateBatchPage,
} from './pages/documents';

import {
    CreateIndexPage,
    CreateFTSIndexPage,
    DeleteIndexPage,
    ListIndexesPage
} from './pages/indexes';

import {
    LiveQueryPage,
    QueryFTSPage,
    SqlPlusPlusPage,
} from './pages/query';

import {
    AllTestsPage,
    ConsoleLoggingTestsPage,
    CustomLoggingTestsPage,
    DatabaseTestsPage,
    CollectionTestsPage,
    DocumentTestsPage,
    DocumentExpirationTestsPage,
    FileLoggingTestsPage,
    IndexingTestsPage,
    NotificationsTestsPage,
    PredicateQueryTestsPage,
    QueryTestsPage,
    ReplicatorTestsPage,
    TestingTestPage,
    VectorSearchTestsPage,
} from './pages/tests';

import {
    ConsoleLogPage,
    CustomLogPage,
    FileLogPage,
} from './pages/logging/';

import {
    ReplicatorLivePage,
    ReplicatorConfigPage
} from './pages/replication/';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ChangeEncryptionKey from "./pages/databases/ChangeEncryptionKey";

setupIonicReact();
const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main">
                    <Menu />
                    <IonRouterOutlet id="main">
                        <Route path="/tests/all" component={AllTestsPage} exact />
                        <Route path="/tests/consoleLogging" component={ConsoleLoggingTestsPage} exact />
                        <Route path="/tests/customLogging" component={CustomLoggingTestsPage} exact />
                        <Route path="/tests/databases" component={DatabaseTestsPage} exact />
                        <Route path="/tests/collections" component={CollectionTestsPage} exact />
                        <Route path="/tests/document" component={DocumentTestsPage} exact />
                        <Route path="/tests/documentExpiration" component={DocumentExpirationTestsPage} exact />
                        <Route path="/tests/fileLogging" component={FileLoggingTestsPage} exact />
                        <Route path="/tests/indexes" component={IndexingTestsPage} exact />
                        <Route path="/tests/notifications" component={NotificationsTestsPage} exact />
                        <Route path="/tests/predicateQuery" component={PredicateQueryTestsPage} exact />
                        <Route path="/tests/query" component={QueryTestsPage} exact />
                        <Route path="/tests/replicator" component={ReplicatorTestsPage} exact />
                        <Route path="/tests/vectorSearch" component={VectorSearchTestsPage} exact />
                        <Route path="/tests/testing" component={TestingTestPage} exact />

                        <Route path="/log/console" component={ConsoleLogPage} exact />
                        <Route path="/log/file" component={FileLogPage} exact />
                        <Route path="/log/custom" component={CustomLogPage} exact />

                        <Route path="/database/setup" component={DatabaseSetupPage} exact />
                        <Route path="/database/open" component={DatabaseOpenPage} exact />
                        <Route path="/database/close" component={DatabaseClosePage} exact />
                        <Route path="/database/copy" component={DatabaseCopyPage} exact />
                        <Route path="/database/changeKey" component={ChangeEncryptionKeyPage} exact />

                        <Route path="/database/delete" component={DatabaseDeletePage} exact />
                        <Route path="/database/maintenance" component={PerformMaintenancePage} exact />

                        <Route path="/database/collection/create" component={CollectionCreatePage} exact />
                        <Route path="/database/collection/delete" component={CollectionDeletePage} exact />
                        <Route path="/database/collections" component={CollectionListPage} exact />
                        <Route path="/database/collections/default" component={CollectionDefaultPage} exact />
                        <Route path="/database/scopes" component={ScopeListPage} exact />
                        <Route path="/database/collections/scopes/default" component={ScopeDefaultPage} exact />
                        <Route path="/database/collection/change" component={CollectionChangePage} exact />

                        <Route path="/documents/create" component={EditDocumentPage} exact />
                        <Route path="/documents/get" component={GetDocumnetPage} exact />
                        <Route path="/documents/setExpiration" component={SetDocumentExpirationPage} exact />
                        <Route path="/documents/change" component={ChangeDocumnetPage} exact />
                        <Route path="/documents/delete" component={DeleteDocumentPage} exact />
                        <Route path="/documents/batch/create" component={CreateBatchPage} exact />

                        <Route path="/index/create" component={CreateIndexPage} exact />
                        <Route path="/index/createFTS" component={CreateFTSIndexPage} exact />
                        <Route path="/index/delete" component={DeleteIndexPage} exact />
                        <Route path="/index/list" component={ListIndexesPage} exact />

                        <Route path="/query/liveQuery" component={LiveQueryPage} exact />
                        <Route path="/query/queryFTS" component={QueryFTSPage} exact />
                        <Route path="/query/sqlPlusPlus" component={SqlPlusPlusPage} exact />

                        <Route path="/replication/replicatorConfig" component={ReplicatorConfigPage} exact />
                        <Route path="/replication/replicatorLive" component={ReplicatorLivePage} exact />

                        <Route path="/home" component={Page} exact />
                        <Redirect from="/" to="/home" exact />
                    </IonRouterOutlet>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;