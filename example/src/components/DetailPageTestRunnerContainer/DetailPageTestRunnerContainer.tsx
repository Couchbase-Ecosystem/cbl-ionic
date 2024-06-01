// DetailPageTestContainerRunner.tsx
import './DetailPageTestRunnerContainer.css';
import React from 'react';
import useState from 'react-usestateref';
import { TestRunner, ITestResult, TestCase } from 'cbl-ionic';

import {
  IonButtons,
  IonButton,
  IonMenuButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonContent,
  IonItemDivider,
  IonToggle,
  IonLabel,
} from '@ionic/react';

interface ContainerProps<T extends new () => TestCase> {
  navigationTitle: string;
  collapseTitle: string;
  testCases: T[];
}

const DetailPageTestRunnerContainer: React.FC<ContainerProps<new () => TestCase>> 
  = ({ navigationTitle, collapseTitle, testCases }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [shouldCancel, setShouldCancel] = useState<boolean>(false);
  const [resultMessages, setResultMessages] = useState<ITestResult[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ITestResult | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);

  function reset() {
    setSuccessCount(0);
    setFailedCount(0);
    setShowDetails(false);
    setShouldCancel(false);
    setResultMessages([]);
    setCurrentMessage(null);
  }

  function shouldTestCaseCancel (): boolean { 
    return shouldCancel;
  } 

  async function update() {
    setCurrentMessage(null);
    setResultMessages([]);
    setSuccessCount(0);
    setFailedCount(0);

    //TODO fix cancellation token
    for (const element of testCases) {
      setCurrentMessage(null);
      const testRunner = new TestRunner();
      const testGenerator = testRunner.runTests(
        element,
        shouldTestCaseCancel,
      );
        for await (const result of testGenerator) {
          if (result.message === 'running') {
            setCurrentMessage(result);
          } else {
            if (result.success) {
              setSuccessCount(successCount => successCount + 1);
            } else {
              setFailedCount(failedCount => failedCount + 1);
            }
            setResultMessages(prev => [...prev, result]);
          }
        }
        setCurrentMessage(null); 
      }
    }
    
  return (
    <IonPage key="page-key">
      <IonHeader key="page-header-key">
        <IonToolbar key="page-header-toolbar-key">
          <IonButtons slot="start" key="page-header-left-buttons-key">
            <IonMenuButton />
          </IonButtons>
          <IonTitle key="page-header-title-key">{collapseTitle}</IonTitle>
          <IonButtons slot="end" key="page-header-right-buttons-key">
            <IonButton onClick={reset} key="reset-button-key">
              <i className="fa-duotone fa-arrows-rotate"></i>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen key="main-content-key">
        <IonHeader collapse="condense" key="main-content-header-key">
          <IonToolbar key="main-content-header-toolbar-key">
            <IonTitle key="main-content-header-title-key" size="large">{navigationTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList key="main-content-list-key">
          <IonItemDivider class="mb-4" key="main-content-list-run-tests-divider-key">
            <IonLabel key="main-content-list-run-tests-label-key">Run Tests</IonLabel>
            <IonButtons slot="end" key="main-content-lists-run-tests-buttons-key">
              <IonToggle key="main-content-lists-run-tests-toggle-key"
                onIonChange={(e: any) => setShowDetails(e.detail.checked)}
                checked={showDetails}
              >
                Show Details
              </IonToggle>
              <IonButton 
                key="main-content-lists-run-tests-cancel-button-key"
                onClick={() => setShouldCancel(true)}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 2px 0px 25px',
                }}
              >
                <i className="fa-solid fa-stop"></i>
              </IonButton>
              <IonButton
                key="main-content-lists-run-tests-action-button-key"
                onClick={update}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '0px 2px 0px 25px',
                }}
              >
                <i className="fa-duotone fa-play"></i>
              </IonButton>
            </IonButtons>
          </IonItemDivider>
          {currentMessage !== null ? (
            <IonItem key="main-content-lists-current-running-item-key">
              <IonLabel key="main-content-lists-current-running-label-key">
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                  <h2>{currentMessage.testName}</h2>
                  <i className="fa-duotone fa-spinner-third fa-spin"></i>
                </div>
                {showDetails && <p>{currentMessage.message}</p>}
              </IonLabel>
            </IonItem>
          ) : (
            <></>
          )}
          <IonItemDivider key="main-content-lists-status-divider-key">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <IonLabel key="main-content-lists-status-label-success-key">Success: {successCount}</IonLabel>
              <IonLabel key="main-content-lists-status-label-failed-key">Failed: {failedCount}</IonLabel>
            </div>
          </IonItemDivider>
          {
            Array.from(resultMessages.values()).map((result, index) => (
              <IonItem key={'main-content-lists-status-item-' + index}>
                <IonLabel key={'main-content-lists-status-label-' + index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <h2>{result.testName}</h2>
                    {result.message === 'running' ? (
                      <i className="fa-duotone fa-spinner-third fa-spin"></i>
                    ) : (
                      <i
                        className={`fa-duotone ${
                          result.success ? 'fa-check' : 'fa-x'
                        }`}
                      ></i>
                    )}
                  </div>
                  {showDetails && <p>{result.message}</p>}
                </IonLabel>
              </IonItem>
            ))
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DetailPageTestRunnerContainer;
