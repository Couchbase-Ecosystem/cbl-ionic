import { Database } from 'cbl-ionic';
import React from "react";

export type DatabaseContextType = {
	databases: Record<string, Database>;
	setDatabases: React.Dispatch<React.SetStateAction<Record<string, Database>>>;
  };