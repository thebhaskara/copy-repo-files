import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tempDir = path.join(__dirname, "temp-repo")

const destinationDir = process.cwd()

const args = [...process.argv]
if (args[0].endsWith("node")) {
	args.shift()
}
if (args[0].endsWith("node.exe")) {
	args.shift()
}
if (args[0].endsWith("npx")) {
	args.shift()
}
if (args[0].includes("copy-repo-files")) {
	args.shift()
}

if (args.length >= 3) {
	// Input arguments
	const [sourceRepoUrl, branchName, filePath, destinationPath] = process.argv.slice(2)

	copyFileFromRepo(generateSourceRepoUrl(sourceRepoUrl), tempDir, branchName, filePath, destinationPath, () => {
		updatePackageJson({
			sourceRepoUrl,
			branchName,
			filePath,
			destinationPath,
		})
		process.exit(1)
	})
} else if (args[0] == "install") {
	let packageJson = getPackageJson(path.join(__dirname, "package.json"))
	let copyRepoFiles = packageJson.copyRepoFiles
	if (copyRepoFiles && copyRepoFiles.length > 0) {
		copyRepoFiles.forEach((obj) => {
			copyFileFromRepo(
				generateSourceRepoUrl(obj.sourceRepoUrl),
				tempDir,
				obj.branchName,
				obj.filePath,
				obj.destinationPath,
				() => {
					console.log("Files copied successfully!")
				}
			)
		})
	} else {
		console.log("No files to copy.")
	}
}

/**
 * functions
 */

export async function copyFileFromRepo(sourceRepoURL, tempDir, branchName, filePath, destinationPath, exit) {
	try {
		let sourceRepoUrlSplit = sourceRepoURL.replace(".git", "").split("/").pop()

		let folder = `${tempDir}/${sourceRepoUrlSplit}/${branchName}`

		if (fs.existsSync(folder)) {
			console.log("Repo already cloned")
		} else {
			fs.mkdirSync(folder, { recursive: true })
			// Clone the source repo into the temp directory
			console.log("Cloning the source repository...")
			await runCommand(`git clone ${sourceRepoURL} ${folder}`)
		}

		// Navigate to the temp directory
		process.chdir(folder)

		// Checkout the specified branch
		console.log(`Checking out branch: ${branchName}...`)
		await runCommand(`git checkout ${branchName}`)
		await runCommand(`git pull`)

		// Verify the file exists in the source repo
		const sourceFilePath = path.join(folder, filePath)
		if (!fs.existsSync(sourceFilePath)) {
			console.error(`Error: File ${filePath} does not exist in the source repository.`)
			exit?.()
		}

		let filename = filePath.split("/").pop()
		// Copy the file to the destination directory
		const destinationFilePath = path.join(destinationDir, destinationPath || "./", filename)
		const destinationFolder = path.dirname(destinationFilePath)

		// Ensure the destination folder exists
		fs.mkdirSync(destinationFolder, { recursive: true })

		console.log(`Copying file ${filePath} to ${destinationFilePath}`)
		fs.copyFileSync(sourceFilePath, destinationFilePath)

		console.log(`File ${filePath} has been successfully copied.`)
	} catch (error) {
		console.error(error)
	} finally {
		exit?.()
	}
}

/**
 *
 * @param {string} command
 * @returns
 */
function runCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(`Error: ${stderr || error.message}`)
			} else {
				resolve(stdout)
			}
		})
	})
}

export function generateSourceRepoUrl(srcUrl) {
	// let srcUrl = sourceRepoUrl;

	if (srcUrl.startsWith("git:")) {
		srcUrl = srcUrl.replace("git:", "https://github.com/")
	} else if (srcUrl.startsWith("bitbucket:")) {
		srcUrl = srcUrl.replace("bitbucket:", "https://bitbucket.org/")
	}

	if (!srcUrl.endsWith(".git")) {
		srcUrl = srcUrl + ".git"
	}
	return srcUrl
}

function getPackageJson(packageJsonPath) {
	let data = fs.readFileSync(packageJsonPath, "utf8")
	try {
		return JSON.parse(data)
	} catch (parseErr) {
		console.error("Error parsing package.json:", parseErr)
		return {}
	}
}

function updatePackageJson(obj) {
	let packageJsonPath = path.join(__dirname, "package.json")
	let packageJson = getPackageJson(packageJsonPath)

	if (obj) {
		// Modify the package.json object
		packageJson.copyRepoFiles = [...(packageJson.copyRepoFiles ?? []), obj]

		packageJson.copyRepoFiles = packageJson.copyRepoFiles.filter(
			(item, index, self) => self.findIndex((t) => JSON.stringify(t) === JSON.stringify(item)) === index
		)
	}

	// Convert the JSON object back to a string
	const updatedPackageJson = JSON.stringify(packageJson, null, 2)

	// Write the updated string back to the package.json file
	fs.writeFileSync(packageJsonPath, updatedPackageJson, "utf8")
	console.log("package.json has been updated successfully.")
}
