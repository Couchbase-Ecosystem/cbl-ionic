import React, { useState, ReactNode, useMemo } from 'react';

import {
  Database,
  CapacitorEngine,
  Replicator,
  ReplicatorConfiguration
} from 'cbl-ionic';

import DatabaseContext from './DatabaseContext';
import ReplicatorContext from './ReplicatorContext';

type CBLiteProviderProps = {
  children: ReactNode;
};

const CBLiteProvider: React.FC<CBLiteProviderProps> = ({ children }) => {

  const [databases, setDatabases] = useState<Record<string, Database>>({});
  const [replicator, setReplicator] = useState<Replicator | null>(null);
  const [replicatorConfig, setReplicatorConfig] = useState<ReplicatorConfiguration | null>(null);
  const databasesValue = useMemo(() => ({ databases, setDatabases }), [databases, setDatabases]);
  const replicatorContextValue = useMemo(() => ({
    replicator,
    setReplicator,
    replicatorConfig,
    setReplicatorConfig
  }), [replicator, setReplicator, replicatorConfig, setReplicatorConfig]);
  const engine = new CapacitorEngine();

  return (
    <DatabaseContext.Provider value={databasesValue}>
      <ReplicatorContext.Provider value={replicatorContextValue}>
        {children}
      </ReplicatorContext.Provider>
    </DatabaseContext.Provider>
  );
};

export default CBLiteProvider;
