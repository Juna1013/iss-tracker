interface Props {
  title: string;
  value: string;
  icon: string;
}

export default function InfoCard({ title, value, icon }: Props) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
      <div className="mb-2 text-2xl">{icon}</div>
      <h3 className="mb-1 text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
