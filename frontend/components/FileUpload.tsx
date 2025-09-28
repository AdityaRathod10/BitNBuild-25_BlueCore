// components/FileUpload.tsx
import { useDropzone } from 'react-dropzone';

export function FileUpload() {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        multiple: true,
        onDrop: (files) => {
            // Process uploaded files
        }
    });
    
    return (
        <div {...getRootProps()} className="border-2 border-dashed p-8">
            <input {...getInputProps()} />
            <p>Drop bank statements here or click to upload</p>
        </div>
    );
}