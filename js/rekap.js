const rekapBody = document.getElementById("rekapBody");
const bulanInput = document.getElementById("bulan");

// set default bulan sekarang
bulanInput.value = new Date().toISOString().slice(0, 7);

async function loadRekap() {
  rekapBody.innerHTML = "Loading...";

  const bulan = bulanInput.value; // YYYY-MM
  if (!bulan) return;

  const anggotaSnap = await db.collection("anggota")
    .where("aktif", "==", true)
    .get();

  const anggota = {};
  anggotaSnap.forEach(doc => {
    anggota[doc.id] = {
      nama: doc.data().nama,
      hadir: 0
    };
  });

  const absenSnap = await db.collection("absen").get();

  let totalHari = 0;

  absenSnap.forEach(doc => {
    if (doc.id.startsWith(bulan)) {
      totalHari++;
      const hadirData = doc.data().hadir || {};
      Object.keys(hadirData).forEach(id => {
        if (hadirData[id] && anggota[id]) {
          anggota[id].hadir++;
        }
      });
    }
  });

  rekapBody.innerHTML = "";

  Object.values(anggota).forEach(a => {
    const full = totalHari > 0 && a.hadir === totalHari;
    rekapBody.innerHTML += `
      <tr class="${full ? "full" : ""}">
        <td>${a.nama}</td>
        <td>${a.hadir}</td>
        <td>${full ? "⭐ Full" : "-"}</td>
      </tr>
    `;
  });
}
