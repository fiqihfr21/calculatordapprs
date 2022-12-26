import assert from 'assert';
import * as anchor from '@project-serum/anchor';
import { AnchorProvider, web3 } from '@project-serum/anchor';
const { SystemProgram } = web3;

describe('mycalcdapp', () => {
  const provider = AnchorProvider.local();
  anchor.setProvider(provider);
  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Calculatordapp;

  it('creates a calculator', async () => {
    await program.rpc.create('Welcome to solana', {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator],
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting === 'Welcome to solana');
  });

  it('add to number', async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(1), {
      accounts: {
        calculator: calculator.publicKey,
      }
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(3)));
  });

  it('min to number', async () => {
    await program.rpc.min(new anchor.BN(2), new anchor.BN(1), {
      accounts: {
        calculator: calculator.publicKey,
      }
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(1)));
  });
});