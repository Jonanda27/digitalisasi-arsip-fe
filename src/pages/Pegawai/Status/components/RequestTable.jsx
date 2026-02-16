import RequestRow from "./RequestRow";

export default function RequestTable({ data }) {
  const headers = ["Nama Dokumen", "Tgl Ajukan", "Keperluan", "Akses", "Status", "Tgl Setuju", "Masa Akses"];
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[1000px]">
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th 
                key={h} 
                className={`text-left py-4 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 ${index === 0 ? 'pl-6' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <RequestRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}