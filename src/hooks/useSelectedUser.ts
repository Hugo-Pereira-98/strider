import { InstitutionMemberContext } from '@/contexts/InstitutionMemberContext';
import { useContext } from 'react';

export function useInstitutionMember() {
  return useContext(InstitutionMemberContext);
}
