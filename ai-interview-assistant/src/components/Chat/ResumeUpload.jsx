import React, { useRef, useState } from 'react';
import { parsePDF, parseDOCX } from '../../utils/parseResume';
import { useDispatch } from 'react-redux';
import { setProfile, setMissingFields } from '../../redux/interviewSlice';

const ResumeUpload = () => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const fileRef = useRef();

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    setError('');
    if (!file) return;

    try {
      let data = {};
      if (file.type === 'application/pdf') {
        data = await parsePDF(file);
      } else if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        data = await parseDOCX(file);
      } else {
        setError('Unsupported file type. Please upload a PDF or DOCX resume.');
        return;
      }
      // Check for missing fields
      const missing = [];
      if (!data.name) missing.push('name');
      if (!data.email) missing.push('email');
      if (!data.phone) missing.push('phone');
      dispatch(setProfile(data));
      dispatch(setMissingFields(missing));
    } catch (err) {
      setError('Could not parse resume. Please try a different file.');
    }
  };

  return (
    <div className="mb-3">
      <input
        type="file"
        ref={fileRef}
        onChange={onFileChange}
        className="form-control"
        accept=".pdf,.docx"
      />
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
};

export default ResumeUpload;
