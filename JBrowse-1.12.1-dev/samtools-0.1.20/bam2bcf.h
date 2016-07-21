#ifndef BAM2BCF_H
#define BAM2BCF_H

#include <stdint.h>
#include "errmod.h"
#include "bcftools/bcf.h"

#define B2B_INDEL_NULL 10000

#define B2B_FMT_DP 0x1
#define B2B_FMT_SP 0x2
#define B2B_FMT_DV 0x4

typedef struct __bcf_callaux_t {
	int capQ, min_baseQ;
	int openQ, extQ, tandemQ; // for indels
	int min_support, max_support; // for collecting indel candidates
	double min_frac, max_frac; // for collecting indel candidates
    int per_sample_flt; // indel filtering strategy
    int *ref_pos, *alt_pos, npos; // for ReadPosBias
	// for internal uses
	int max_bases;
	int indel_types[4];
	int maxins, indelreg;
    int read_len;
	char *inscns;
	uint16_t *bases;
	errmod_t *e;
	void *rghash;
} bcf_callaux_t;

typedef struct {
	unsigned int depth, n_supp, ori_depth, qsum[4], mq0;
    // The fields are:
    //      depth fwd   .. ref (0) and non-ref (2)
    //      depth rev   .. ref (1) and non-ref (3)
    //      baseQ       .. ref (4) and non-ref (6)
    //      baseQ^2     .. ref (5) and non-ref (7)
    //      mapQ        .. ref (8) and non-ref (10)
    //      mapQ^2      .. ref (9) and non-ref (11)
    //      minDist     .. ref (12) and non-ref (14)
    //      minDist^2   .. ref (13) and non-ref (15)
    // Note that this probably needs a more thorough fix: int types in
    // bcf_call_t do overflow with high-coverage data, such as exomes, and
    // BCFv2 supports only floats which may not suffice.
	double anno[16];
	float p[25];
} bcf_callret1_t;

typedef struct {
	int a[5]; // alleles: ref, alt, alt2, alt3
    float qsum[4];
	int n, n_alleles, shift, ori_ref, unseen;
	int n_supp; // number of supporting non-reference reads
	double anno[16];
    unsigned int depth, ori_depth, mq0;
	uint8_t *PL;
    float vdb; // variant distance bias
    float read_pos_bias;
    float seg_bias;
} bcf_call_t;

#ifdef __cplusplus
extern "C" {
#endif

	bcf_callaux_t *bcf_call_init(double theta, int min_baseQ);
	void bcf_call_destroy(bcf_callaux_t *bca);
	int bcf_call_glfgen(int _n, const bam_pileup1_t *pl, int ref_base, bcf_callaux_t *bca, bcf_callret1_t *r);
	int bcf_call_combine(int n, const bcf_callret1_t *calls, bcf_callaux_t *bca, int ref_base /*4-bit*/, bcf_call_t *call);
	int bcf_call2bcf(int tid, int pos, bcf_call_t *bc, bcf1_t *b, bcf_callret1_t *bcr, int fmt_flag,
					 const bcf_callaux_t *bca, const char *ref);
	int bcf_call_gap_prep(int n, int *n_plp, bam_pileup1_t **plp, int pos, bcf_callaux_t *bca, const char *ref,
						  const void *rghash);

#ifdef __cplusplus
}
#endif

#endif
