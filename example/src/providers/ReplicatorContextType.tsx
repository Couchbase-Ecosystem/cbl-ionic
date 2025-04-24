import React from 'react';
import { Replicator, ReplicatorConfiguration } from 'cbl-ionic';
export type ReplicatorContextType = {
	replicator: Replicator | null;
	setReplicator: React.Dispatch<React.SetStateAction<Replicator | null>>;
	replicatorConfig: ReplicatorConfiguration | null;
	setReplicatorConfig: React.Dispatch<React.SetStateAction<ReplicatorConfiguration | null>>;
};