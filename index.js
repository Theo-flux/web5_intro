import { Web5 } from '@web5/api';
import { VerifiableCredential } from '@web5/credentials';

/**
 * The connect() function creates an instance of Web5 and
 * also creates a decentralized identifier or obtains connection to an existing one.
 */
const { web5, did: aliceDid } = await Web5.connect();
// console.log(aliceDid);

/**
 * Access Bearer DID
 */
const { did: aliceBearerDid } = await web5.agent.identity.get({
  didUri: aliceDid,
});
// console.log(aliceBearerDid);

/**
 * Creating a verifiable credential (VC)
 */
const type = 'Web5QuickstartCompletionCredential';
const web5QuickStartCredentialData = {
  name: 'Alice smith',
  completionDate: new Date().getTime(),
  expertiseLevel: 'Beginner',
};
const vc = await VerifiableCredential.create({
  type,
  issuer: aliceDid,
  subject: aliceDid,
  data: web5QuickStartCredentialData,
});
// console.log(vc);

/**
 * Sign VC
 */
const signedVC = await vc.sign({ did: aliceBearerDid });
// console.log(signedVC);

/**
 * store vc in DWN (Decentralised Web Nodes)
 */

const request = {
  data: signedVC,
  message: {
    schema: type,
    dataFormat: 'application/vc+jwt',
    published: true,
  },
};

const { record } = await web5.dwn.records.create(request);
// console.log('write result: ', record);

/**
 * Read vc from dwn
 */
const vcJwt = await record.data.text();
// console.log(vcJwt);

/**
 * Parsing/decoding application/vc+jwt data
 */
const parsedVcJwt = VerifiableCredential.parseJwt({ vcJwt });
console.log(parsedVcJwt);
