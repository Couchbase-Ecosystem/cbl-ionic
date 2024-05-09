import React from 'react';
import { DatabaseContextType } from './DatabaseContextType';

const DatabaseContext = React.createContext<DatabaseContextType | undefined>(undefined);

export default DatabaseContext;