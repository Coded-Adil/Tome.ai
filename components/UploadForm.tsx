'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileImage, FileText, Upload, X } from 'lucide-react';
import { useForm, type FieldPath, type FieldValues } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { UploadSchema } from '@/lib/zod';
import { cn } from '@/lib/utils';
import type { BookUploadFormValues } from '@/types';

const voiceGroups = [
  {
    label: 'Male Voices',
    voices: [
      { id: 'dave', name: 'Dave', description: 'Steady, reflective, and grounded.' },
      { id: 'daniel', name: 'Daniel', description: 'Warmly narrated with a classic cadence.' },
      { id: 'chris', name: 'Chris', description: 'Clear, conversational, and inviting.' },
    ],
  },
  {
    label: 'Female Voices',
    voices: [
      { id: 'rachel', name: 'Rachel', description: 'Graceful, warm, and intimate.' },
      { id: 'sarah', name: 'Sarah', description: 'Poised, bright, and gently expressive.' },
    ],
  },
] as const;

type FileFieldProps<T extends FieldValues> = {
  control: ReturnType<typeof useForm<T>>['control'];
  name: FieldPath<T>;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  hint: string;
  accept: string;
  disabled?: boolean;
};

const formatFileName = (file: File) =>
  file.name.length > 42 ? `${file.name.slice(0, 39)}...` : file.name;

const FileUploadField = <T extends FieldValues>({
  control,
  name,
  icon: Icon,
  title,
  hint,
  accept,
  disabled,
}: FileFieldProps<T>) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedFile = field.value as File | undefined;
        const isUploaded = !!selectedFile;

        const handleFileSelect = (file?: File) => {
          field.onChange(file);
        };

        const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
          event.preventDefault();
          if (disabled) {
            return;
          }

          const droppedFile = event.dataTransfer.files?.[0];
          if (droppedFile) {
            handleFileSelect(droppedFile);
          }
        };

        return (
          <FormItem className="space-y-3">
            <FormControl>
              <div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  className="sr-only"
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    handleFileSelect(file);
                  }}
                />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  disabled={disabled}
                  className={cn(
                    'upload-dropzone w-full border-2 border-dashed border-[color:var(--border-medium)] px-6',
                    isUploaded && 'upload-dropzone-uploaded border-[#663820]',
                    fieldState.error && 'border-destructive'
                  )}
                >
                  <Icon className="upload-dropzone-icon" />

                  {selectedFile ? (
                    <div className="flex w-full max-w-md items-center justify-center gap-3">
                      <div className="min-w-0 text-center">
                        <p className="upload-dropzone-text">{formatFileName(selectedFile)}</p>
                        <p className="upload-dropzone-hint">Click to change file</p>
                      </div>

                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${selectedFile.name}`}
                        className="upload-dropzone-remove"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleFileSelect(undefined);
                          if (inputRef.current) {
                            inputRef.current.value = '';
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleFileSelect(undefined);
                            if (inputRef.current) {
                              inputRef.current.value = '';
                            }
                          }
                        }}
                      >
                        <X className="size-4" />
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="upload-dropzone-text">{title}</p>
                      <p className="upload-dropzone-hint">{hint}</p>
                    </>
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: '',
      author: '',
      coverImage: undefined,
      pdf: undefined as never,
      voice: 'rachel',
    },
  });

  const onSubmit = async (values: BookUploadFormValues) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1400));
      console.log('Book upload payload', values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LoadingOverlay open={isSubmitting} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="new-book-wrapper space-y-8"
        >
          <FileUploadField
            control={form.control}
            name="pdf"
            icon={Upload}
            title="Click to upload PDF"
            hint="PDF file (max 50MB)"
            accept="application/pdf"
            disabled={isSubmitting}
          />

          <FileUploadField
            control={form.control}
            name="coverImage"
            icon={FileImage}
            title="Click to upload cover image"
            hint="Leave empty to auto-generate from PDF"
            accept="image/*"
            disabled={isSubmitting}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="text"
                    placeholder="ex: Rich Dad Poor Dad"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="text"
                    placeholder="ex: Robert Kiyosaki"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                <FormControl>
                  <div className="grid gap-4 md:grid-cols-2">
                    {voiceGroups.map((group) => (
                      <div
                        key={group.label}
                        className="rounded-[14px] bg-[var(--bg-tertiary)] p-4 shadow-[var(--shadow-soft-sm)]"
                      >
                        <h3 className="mb-3 font-serif text-lg text-[var(--text-primary)]">
                          {group.label}
                        </h3>

                        <div className="space-y-3">
                          {group.voices.map((voice) => {
                            const isSelected = field.value === voice.id;

                            return (
                              <label
                                key={voice.id}
                                className={cn(
                                  'voice-selector-option voice-selector-option-default flex-col items-start text-left',
                                  isSelected && 'voice-selector-option-selected'
                                )}
                              >
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={voice.id}
                                  checked={isSelected}
                                  onChange={() => field.onChange(voice.id)}
                                  className="sr-only"
                                  disabled={isSubmitting}
                                />

                                <div className="flex w-full items-start justify-between gap-3">
                                  <div>
                                    <p className="font-serif text-lg text-[var(--text-primary)]">
                                      {voice.name}
                                    </p>
                                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                      {voice.description}
                                    </p>
                                  </div>
                                  <FileText className="mt-1 size-4 text-[#8B7355]" />
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit" className="form-btn" disabled={isSubmitting}>
            Begin Synthesis
          </button>
        </form>
      </Form>
    </>
  );
};

export default UploadForm;
