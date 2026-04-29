export interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}