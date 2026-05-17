import { db } from "../connect.js";

// GET /api/profile/address/:userid
export const getAddress = (req, res) => {
	const userid = req.params.userid || req.query.userid;
	if (!userid) return res.status(400).json({ message: "userid required" });

	const q = "SELECT id, userid, address, city, pincode, state, contact, updated_at FROM profiles WHERE userid = ? LIMIT 1";
	db.query(q, [userid], (err, results) => {
		if (err) return res.status(500).json({ message: "DB error", error: err });
		if (results.length === 0) return res.json({ address: null });
		return res.json({ address: results[0] });
	});
};

// PUT /api/profile/address
export const upsertAddress = (req, res) => {
	const { userid, address = "", city = "", pincode = "", state = "", contact = "" } = req.body;
	if (!userid) return res.status(400).json({ message: "userid required" });

	const checkQ = "SELECT id FROM profiles WHERE userid = ? LIMIT 1";
	db.query(checkQ, [userid], (err, results) => {
		if (err) return res.status(500).json({ message: "DB error", error: err });

		if (results.length > 0) {
			const updateQ = `UPDATE profiles SET address = ?, city = ?, pincode = ?, state = ?, contact = ?, updated_at = NOW() WHERE userid = ?`;
			db.query(updateQ, [address, city, pincode, state, contact, userid], (uErr) => {
				if (uErr) return res.status(500).json({ message: "DB update error", error: uErr });
				return res.json({ message: "updated" });
			});
		} else {
			const insertQ = `INSERT INTO profiles (userid, address, city, pincode, state, contact, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
			db.query(insertQ, [userid, address, city, pincode, state, contact], (iErr) => {
				if (iErr) return res.status(500).json({ message: "DB insert error", error: iErr });
				return res.json({ message: "inserted" });
			});
		}
	});
};

// POST /api/profile/upload
export const uploadProfilePhoto = (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const q = "UPDATE profiles SET profileimage = ? WHERE id = ?";
  db.query(q, [fileUrl, userId], (err) => {
    if (err) return res.status(500).json({ message: "DB update error", error: err });
    return res.json({ message: "uploaded", fileUrl });
  });
};
