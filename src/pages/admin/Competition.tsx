
import React from 'react';
import { useCMSStore } from '../../store/useStore';
import CompetitionBrackets from '../../admin/modules/CompetitionBrackets';

export default function Competition() {
  const { state, setData } = useCMSStore();

  return (
    <CompetitionBrackets data={state} setData={setData} />
  );
}
