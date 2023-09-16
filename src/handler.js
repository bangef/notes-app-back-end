/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((e) => e.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus!',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const { title, tags, body } = req.payload;
  const index = notes.findIndex((e) => e.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      updateAt: new Date().toISOString(),
      body,
    };

    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    res.code(200);
    return res;
  }

  const res = h.res({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.find((e) => ((e.id === id) ? e.id : false));
  if (note) {
    const res = h.response({
      status: 'success',
      data: { note },
    });
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  res.code(404);
  return res;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updateAt = createdAt;

  notes.push({
    id, title, createdAt, updateAt, tags, body,
  });

  const isSuccess = notes.filter((e) => e.id === id).length > 0;

  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan!',
      data: {
        noteId: id,
      },
    });
    res.code(201);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  res.code(500);
  return res;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
