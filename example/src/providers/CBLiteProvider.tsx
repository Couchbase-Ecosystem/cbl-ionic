import React, { useState, ReactNode, useMemo } from 'react';

import {
  Database,
  CapacitorEngine
} from 'cbl-ionic';

import DatabaseContext from './DatabaseContext';
import ReplicatorContext from './ReplicatorContext';

type CBLiteProviderProps = {
  children: ReactNode;
};

const CBLiteProvider: React.FC<CBLiteProviderProps> = ({ children }) => {

  const [databases, setDatabases] = useState<Record<string, Database>>({});
  const [replicatorIds, setReplicatorIds] = useState<Record<string, string>>({});

  const databasesValue = useMemo(() => ({ databases, setDatabases }), [databases, setDatabases]);
  const replicatorIdsValue = useMemo(() => ({ replicatorIds, setReplicatorIds }), [replicatorIds, setReplicatorIds]);

  const engine = new CapacitorEngine();

  return (
    <DatabaseContext.Provider value={databasesValue}>
      <ReplicatorContext.Provider value={replicatorIdsValue}>
        {children}
      </ReplicatorContext.Provider>
    </DatabaseContext.Provider>
  );
};

export default CBLiteProvider;
