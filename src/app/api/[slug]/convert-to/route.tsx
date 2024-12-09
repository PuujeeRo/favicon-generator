
// Disable Next.js built-in body parser and set the runtime
export const runtime = 'nodejs'; // Or other configuration options like 'nodejs'
import { NextRequest, NextResponse } from 'next/server';
// import mime from "mime";
import path from 'path';
// import fs from 'fs';
import { stat, mkdir, writeFile, unlink, readFile } from "fs/promises";
import { resolve } from 'path';
import autotrace from 'autotrace';
import formidable from 'formidable';  // Import the default export from formidable
import { join } from "path";

// Disable Next.js built-in body parser
// export const config = {
//   api: {
//     bodyParser: false, // Disable the default body parser to use formidable
//   },
// };


export async function POST(req: NextRequest) {
  // Use formidable as a function, not as a constructor
  const form = formidable({
    uploadDir: resolve(process.cwd(), 'uploads'), // Set the upload directory
    keepExtensions: true, // Retain the file extension
  });

  const formData = await req.formData();
  console.log("req.formData: ", formData);

  try {
    const imageFile = formData.get("image") as File || null;
    // const file = files.image;
    // const imageFile = Array.isArray(file) ? file[0] : file;
    console.log("image: ", imageFile);
    if (!imageFile) {
      return NextResponse.json({ error: 'No valid image uploaded' }, { status: 400 });
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const relativeUploadDir = `/uploads/${new Date(Date.now())
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-")}`;
  
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${imageFile.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}`;

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        // This is for checking the directory is exist (ENOENT : Error No Entry)
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(
          "Error while trying to create directory when uploading a file\n",
          e
        );
        return NextResponse.json(
          { error: "Something went wrong." },
          { status: 500 }
        );
      }
    }

    try {
      await writeFile(`${uploadDir}/${filename}${path.extname(imageFile.name).toLowerCase()}`, buffer);
      const fileUrl = `${relativeUploadDir}/${filename}`;
  
    } catch (e) {
      console.error("Error while trying to upload a file\n", e);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }

    const inputPath = `${uploadDir}/${filename}${path.extname(imageFile.name).toLowerCase()}`;
    const outputPath = `${uploadDir}/${filename}.svg`;

    // colorCount: 16,
    //       background: 'white',
    //       inputFormat: 'image/jpg',
    //       outputFormat: 'svg',
    //       inputFile: ${uploadDir}/${filename}${path.extname(imageFile.name).toLowerCase()},
    //       outputFile: outputPath,

    // await fs.unlink(`${uploadDir}/${filename}`); // Remove the uploaded file after conversion
    try {
        // Run autotrace with minimal options
      const svgData = await autotrace(inputPath, {
          colorCount: 16,
          outputFormat: 'svg',
      });

      console.log("svgData: ", svgData);

      // If `autotrace` returns SVG data directly, save it as a file
      if (typeof svgData === 'string') {
          await writeFile(outputPath, svgData, 'utf-8');
      } else {
          throw new Error("SVG data not generated by autotrace");
      }

      // Read the SVG data to confirm it’s written successfully
      const svgFileContent = await readFile(outputPath, 'utf-8');

      // Optionally delete the file after reading if not needed
      await unlink(outputPath);

      return NextResponse.json({ svg: svgFileContent }, { status: 200 });
    } catch (error) {
      console.log("error: ", error);
      return (NextResponse.json({ error: 'SVG conversion failed' }, { status: 500 }));
    }

  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ error: 'SVG conversion failed' }, { status: 500 });
  }

  // return new Promise((resolve, reject) => {
  //   form.parse(req as any, async (err, fields, files) => { // Parse using form.parse
  //     if (err) {
  //       reject(NextResponse.json({ error: 'Image upload failed' }, { status: 500 }));
  //       return;
  //     }

  //     // Ensure files.image is a single File and not an array
  //     const file = files.image;
  //     const imageFile = Array.isArray(file) ? file[0] : file;

  //     if (!imageFile || !imageFile.filepath) {
  //       reject(NextResponse.json({ error: 'No valid image uploaded' }, { status: 400 }));
  //       return;
  //     }

  //     const imagePath = imageFile.filepath;

  //     try {
  //       const svgData = await autotrace(imagePath, {
  //         colorCount: 16,
  //         background: 'white',
  //         inputFormat: 'image/png',
  //         outputFormat: 'svg',
  //       });

  //       await fs.unlink(imagePath); // Remove the uploaded file after conversion
  //       resolve(NextResponse.json({ svg: svgData }, { status: 200 }));
  //     } catch (error) {
  //       reject(NextResponse.json({ error: 'SVG conversion failed' }, { status: 500 }));
  //     }
  //   });
  // });
}