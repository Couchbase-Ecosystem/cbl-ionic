import React from 'react';
import { ReplicatorContextType } from './ReplicatorContextType';

const ReplicatorContext = React.createContext<ReplicatorContextType | undefined>(undefined);
export default ReplicatorContext;