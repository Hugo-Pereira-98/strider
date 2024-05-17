import { IInstitutionMemberDTO } from '@/dtos';
import { createContext, useEffect, useState } from 'react';

function updateLocalStorage(newMember: IInstitutionMemberDTO) {
  localStorage.setItem('gondola-institutional', JSON.stringify(newMember));
}

export const InstitutionMemberContext = createContext({
  institutionMember: null,
  error: null,
  setInstitutionMember: (member: IInstitutionMemberDTO) => {},
  updateLocalStorage,
} as {
  institutionMember: IInstitutionMemberDTO | null;
  error: any;
  setInstitutionMember(member: IInstitutionMemberDTO): void;
  updateLocalStorage: (member: IInstitutionMemberDTO) => void;
});

export function InstitutionMemberContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [institutionMember, setInstitutionMember] =
    useState<IInstitutionMemberDTO | null>(null);
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false);

  useEffect(() => {
    const cachedMember = localStorage.getItem('gondola-institutional');
    const initialMember = cachedMember ? JSON.parse(cachedMember) : null;

    setInstitutionMember(initialMember);
    setHasCheckedLocalStorage(true);
  }, []);

  const shouldSkipFetch = !!institutionMember || !hasCheckedLocalStorage;

  // return (
  //   <InstitutionMemberContext.Provider
  //     value={{
  //       institutionMember,
  //       error,
  //       setInstitutionMember,
  //       updateLocalStorage,
  //     }}
  //   >
  //     {children}
  //   </InstitutionMemberContext.Provider>
  // );
}
