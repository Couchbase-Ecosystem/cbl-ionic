// PerformMaintenance.tsx
import React, {useContext, useState} from 'react';
import DatabaseContext from '../../providers/DatabaseContext';
import DetailPageContainerRun from '../../components/DetailPageContainerRun/DetailPageContainerRun';

import {IonItem, IonLabel, IonSelect, IonSelectOption,} from '@ionic/react';
import {MaintenanceType} from 'cbl-ionic';

const PerformMaintenancePage: React.FC = () => {
  const { databases } = useContext(DatabaseContext)!;
  const [databaseName, setDatabaseName] = useState<string>('');
  const [selectedMaintenanceJob, setSelectedMaintenanceJob] =
    useState<string>('');
  const [resultsMessage, setResultsMessage] = useState<string[]>([]);
  const maintenanceJobs = ['Compact', 'Reindex', 'IntegrityCheck', 'Optimize', 'Full Optimize'];

  async function update() {
    if (databaseName in databases) {
      const database = databases[databaseName];
      if (database != null) {
        try {
          switch (selectedMaintenanceJob) {
            case "Compact":
              await database.performMaintenance(MaintenanceType.COMPACT);
              setResultsMessage(prev => [...prev, 'Success: Compact']);
              break;
            case "Reindex":
              await database.performMaintenance(MaintenanceType.REINDEX);
              setResultsMessage(prev => [...prev, 'Success: Reindex']);
              break;
            case "IntegrityCheck":
              await database.performMaintenance(MaintenanceType.INTEGRITY_CHECK);
              setResultsMessage(prev => [...prev, 'Success: Integrity Check']);
              break;
            case "Optimize":
              await database.performMaintenance(MaintenanceType.OPTIMIZE);
              setResultsMessage(prev => [...prev, 'Success: Optimize']);
              break;
            case "Full Optimize":
              await database.performMaintenance(MaintenanceType.FULL_OPTIMIZE);
              setResultsMessage(prev => [...prev, 'Success: Full Optimize']);
              break;
            default:
              setResultsMessage(prev => [...prev, 'Error: could not find enum value']);
              break;
          }
        } catch (error) {
          setResultsMessage(prev => [...prev, '' + error]);
        }
      } else {
        setResultsMessage(prev => [...prev, 'Error: Database not found']);
      }
    }
  }

  function reset() {
    setDatabaseName('');
    setResultsMessage([]);
  }

  return (
      <DetailPageContainerRun
          navigationTitle="Database Maintenance"
          collapseTitle="Database Maintenance"
          onReset={reset}
          onAction={update}
          databaseName={databaseName}
          setDatabaseName={setDatabaseName}
          sectionTitle={"Maintenance Jobs"}
          titleButtons={undefined}
          results={resultsMessage}>
        <IonItem key={"item-maintenance-job-select"}>
          <IonLabel key={"item-maintenance-job-label"}>Maintenance Jobs</IonLabel>
          <IonSelect key={"item-maintenance-job-select"}
              value={selectedMaintenanceJob}
              onIonChange={e => setSelectedMaintenanceJob(e.detail.value)}
          >
            {maintenanceJobs.map(value => (
                <IonSelectOption key={"select-option-" + value} value={value}>{value}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </DetailPageContainerRun>
  );
};

export default PerformMaintenancePage;
