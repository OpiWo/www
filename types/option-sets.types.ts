export interface OptionSet {
  id: string;
  name: string;
  description: string;
  optionCount: number;
}

export interface OptionSetsResponse {
  success: true;
  optionSets: OptionSet[];
}
