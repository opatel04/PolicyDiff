// Owner: Dominic
// PolicyUpload — drag-and-drop PDF upload, metadata form, upload progress.
// TODO: call getUploadUrl() then PUT file directly to S3 presigned URL
// TODO: call createPolicy() after successful S3 upload
// TODO: poll getPolicyStatus() until extraction is COMPLETE

export default function UploadPage() {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Upload Policy</h2>
            <p className="text-muted-foreground">Drag-and-drop PDF upload with metadata and progress tracking.</p>
            {/* TODO: implement upload form */}
        </div>
    );
}
