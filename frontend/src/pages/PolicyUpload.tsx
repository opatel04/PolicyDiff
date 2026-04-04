// Owner: Dominic
// PolicyUpload — drag-and-drop PDF upload, metadata form, upload progress.
// TODO: call getUploadUrl() then PUT file directly to S3 presigned URL
// TODO: call createPolicy() after successful S3 upload
// TODO: poll getPolicyStatus() until extraction is COMPLETE

export default function PolicyUpload() {
  return (
    <div className="p-8 text-white">
      <p>PolicyUpload — Owner: Dominic</p>
      {/* TODO: implement upload form */}
    </div>
  );
}
