import RequestRow from "./RequestRow";

export default function RequestTable({ data }) {
  const headers = ["Nama Dokumen", "Tgl Ajukan", "Keperluan", "Akses", "Status", "Tgl Setuju", "Masa Akses"];
  
  return (
    <div className="w-full">
      {/* DESKTOP TABLE */}
      <table className="w-full border-collapse hidden md:table">
        <thead className="sticky top-0 z-20 bg-white">
          <tr className="bg-slate-50/50">
            {headers.map((h, i) => (
              <th 
                key={i} 
                className={`py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 ${i === headers.length - 1 ? 'text-right' : ''}`}
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

      {/* MOBILE LIST AREA */}
      <div className="md:hidden flex flex-col pb-4">
        {data.map((item) => (
          <RequestRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}