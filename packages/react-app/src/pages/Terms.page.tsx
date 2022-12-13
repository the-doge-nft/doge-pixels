import { Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Type } from "../DSL/Fonts/Fonts";
import Link from "../DSL/Link/Link";
import Typography, { TVariant } from "../DSL/Typography/Typography";

const TermsPage = () => {
  return (
    <Box>
      <Typography variant={TVariant.ComicSans16}>Terms and Conditions</Typography>
      <Section>
        The Doge NFT, Inc., a foundation located in the Cayman Islands (“we,” “us,” “our,” etc.), provides the community
        of DOG holders the opportunity to join our Doge Pixel Project (the “Project”) by accepting these terms of use
        and linking your digital wallet to the Project. (A “DOG” is one of the 16,969,696,969 fractional ownership
        interests in the NFT (i.e., a one-of-a-kind, non-fungible, cryptographic token for which there is no copy or
        substitute) that is uniquely associated with the original Doge meme, a photo of the Shiba Inu Kabosu (such
        photo, the “Doge Meme”)). If you join the Project, you may receive (1) the opportunity to mint one or more NFTs
        that are uniquely associated with a single pixel of the Doge Meme (a “Pixel NFT”); (2) if you mint a Pixel NFT,
        access to entertainment and other services, events or activities that are made available only to Pixel NFT
        holders (collectively, “Perks”); and (3) other services (“Additional Services”) that may be made available to
        all members of the Project (each, a “Member”).
      </Section>
      <Section>
        You and we mutually agree that if you have any DOG, lock any DOGs with us, receive your Pixel NFT(s) or use,
        receive or participate in any Perks or any Additional Services, these Doge Pixel Terms of Use (these “Terms”)
        and our{" "}
        <Link isNav to={"/privacy"} fontSize={"14px"} size={"sm"} variant={Type.ComicSans} fontWeight={"bold"}>
          privacy policy
        </Link>{" "}
        (our “Privacy Policy”) will constitute a binding, legally enforceable contract between you and us.
      </Section>
      <Section>
        THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION THAT, AS FURTHER SET FORTH IN THE “ARBITRATION” SECTION
        BELOW, REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES. IT DOES NOT ALLOW JURY TRIALS
        OR ANY OTHER COURT PROCEEDINGS OR CLASS ACTIONS OF ANY KIND.
      </Section>
      <Section title={"Your Pixels"}>
        To mint and receive a Pixel NFT, you must be a Member and transfer one or more Pixel Units to our wallet
        address. “Pixel Unit” means 55,240 DOGs. Only whole Pixel Units may be transferred in connection with the
        Project. For each Pixel Unit that you transfer to our wallet address, you will receive a Pixel NFT. For so long
        as you retain your Pixel NFTs, the Pixel Units that you transfer to us will be locked. That means that, for so
        long as you retain your Pixel NFTs, you cannot transfer your Pixel Units or any part of any Pixel Units (i.e.,
        any DOGs) to anyone or use them for any purpose. The Perks are the only benefits you will receive for locking
        your Pixel Units with us. In particular, you will not earn interest on any of the DOGs that you lock with us.
      </Section>
      <Section title={"Refunds"}>
        You may return your Pixel NFTs at any time. Within a reasonable time after you do that, we will, subject to
        applicable laws and regulations, return to the wallet address that you provided to us 54,688 DOG (representing
        approximately 99% of a Pixel Unit) per Pixel NFT returned and we will retain a fee of 552 DOG (representing
        about 1% of a Pixel Unit) per Pixel NFT returned. All returned Pixel NFTs will be burned. At any time that you
        hold no Pixel NFTs, you will no longer have access to any Perks. At any time that you hold no Pixel NFTs and no
        DOGs, your Membership will terminate, and you will no longer have access to any Additional Services.
      </Section>
      <Section title={"Perks and Additional Services"}>
        We have no obligation to offer any particular Perks or Additional Services, or any particular type or number of
        Perks or Additional Services. Any information that we publish or otherwise provide regarding any actual or
        potential Perks or Additional Services will not give rise to any warranty or other obligation that requires us
        to provide such Perk or Additional Service or to continue to provide such Perk or Additional Service, and we may
        modify or terminate any Perk or Additional Service at any time, without notice, in our sole and absolute
        discretion. We will have no liability or any type or nature in connection with any Perk or Additional Service or
        any loss or unavailability of any Perk or Additional Service.
      </Section>
      <Section title={"Transfers of Your Pixel NFTs"}>
        You may transfer your Pixel NFT(s) using any compatible third-party exchange (such as Opensea) or using any
        other third-party service. The purchaser of any of your Pixel NFTs will receive all, and you will not retain
        any, of the rights or benefits associated with ownership of those NFTs, including the right to receive Perks and
        to receive the associated DOGs that are locked with us and any Additional Services related to those locked DOGs.
        You acknowledge and understand that, if you sell or otherwise transfer any Pixel NFT, you will no longer have
        access to, and will not be able to receive a refund of, any of the DOGs that you locked with us in order to
        receive that Pixel NFT, because only the holder of that Pixel NFT will be entitled to that refund.
      </Section>
      <Section title={"Your Personal Information"}>
        If you wish to lock any DOGs with us, we may require you to provide us with personal information to the extent
        that we determine, in our sole discretion, that we require that information to comply with any laws or
        regulations or for our use in connection with the Project, any Perks, any Additional Services or your Pixel NFT.
        Information we request may include (i) your name, address, email address, date of birth, government-issued photo
        identification, taxpayer identification number, government identification number, bank or other payment account
        information or IP address, (ii) a photo or video of you, (iii) the MAC address of the device you use to access
        any of our services, materials or information, (iv) payment account information (e.g. credit card) and (v)
        information regarding your digital wallet(s). You acknowledge and agree that, subject to our Privacy Policy (i)
        we may disclose the foregoing information and any other information that we request from you (x) to our
        affiliates, vendors or service providers (provided that each such affiliate, vendor or service provider agrees
        or is required to protect, and to refrain from using or disclosing, such information except as expressly
        authorized hereunder) or (y) as may be required by applicable law or any order of any court or governmental
        agency or as may be requested by any law enforcement agency or regulator, and (ii) we and each of our
        affiliates, vendors or service providers may use such information (x) for any of our internal purposes
        (including to improve, enhance or update the Project and related services and, in the case of our affiliates,
        vendors and service providers, to provide services to us) or (y) as we determine in our sole discretion to be
        reasonably necessary or appropriate to authorize or consummate any transaction between you and us involving your
        DOGs, your Pixel NFT or any Perk or Additional Service. You represent and warrant that all information you
        provide to us is true and accurate and that you will immediately update any such information that changes.
      </Section>
      <Section title={"Eligibility"}>
        You may not lock any DOGs with us, receive any Pixel NFTs or use, receive or participate in any Perks or
        Additional Services if (i) you have not accepted and agreed to be bound by these Terms, (ii) you appear on the
        United States Department of the Treasury, Office of Foreign Assets Control (OFAC), Specially Designated
        Nationals List (SDN), United States Commerce Department’s Denied Persons list or other similar lists, (iii) you
        are a national or resident of Cuba, Iran, North Korea, Sudan, Syria or any other country, territory, or other
        jurisdiction that is the subject of comprehensive country-wide, territory-wide, or regional economic sanctions
        by the United States, (iv) you are younger than the age of majority in the jurisdiction in which you reside or
        are otherwise not legally permitted to enter into these Terms, or purchase and use of any Pixel NFTs, Perks or
        Additional Services is not permitted in the jurisdiction you reside.
      </Section>
      <Section title={"Notices Regarding Certain Risks Associated with Digital Assets"}>
        We do not issue DOGs. You must obtain any DOGs that you wish to lock with us from a third party. DOGs (and other
        digital assets) are not insured or guaranteed by any agency of the United States, such as the Federal Deposit
        Insurance Corporation or the Securities Investor Protection Corporation, or by private insurance, against theft
        (including cybertheft or theft by other means) or loss. We will have no liability whatsoever in connection with
        any theft or loss of DOGs or other digital assets. You should assume that DOGs have no market value, and that
        even if a market value or secondary markets exists, the market price may be highly volatile and could decrease
        to zero at any time. We may use shared blockchain addresses, controlled by us, to hold our own digital assets
        and any DOGs locked with us by our Members. We have no obligation to segregate by blockchain address or any
        other means any DOGs locked with us by you from DOGs locked with us by any other Member or from our own digital
        assets. Although we will maintain sufficient liquidity to refund your DOGs as described above, we are free to
        use your DOGs while they are locked with us for any purpose (including, but not limited to, loans and other
        decentralized finance transactions), for our sole benefit. Further, you acknowledge and understand that your
        Pixel NFT is not a medium of exchange and is not convertible virtual currency. Your Pixel NFT will have no
        inherent monetary value whatsoever (other than the right to receive a refund of approximately 99% of the amount
        that you locked with us to receive your Pixel NFT). You acknowledge and understand that any sale or other
        transfer of any your DOGs or Pixel NFTs would occur outside and independently of the Project or any of our
        related services, and that we are in no way involved in any such sale or other transfer. You acknowledge and
        agree that there are inherent risks associated with NFTs. These risks include, but are not limited to, the
        failure of hardware, software or internet connections, the risk of malicious software introduction and the risk
        of unauthorized access to your digital wallet via cyberattacks or otherwise. Further, transfers of NFTs are, as
        a rule, irreversible. Consequently, losses due to fraudulent or accidental transfers are generally not
        recoverable. Thus, it is possible that, through computer or human error, or through theft or fraud, your Pixel
        NFTs may be lost, corrupted, damaged or stolen or become inaccessible. We will not have any liability of any
        type or nature arising out of or relating to the loss, corruption or theft of or damage to your Pixel NFT. If
        any of your Pixel NFTs is lost, corrupted, damaged or stolen, or if you are for any reason unable to access any
        of your Pixel NFTs, you will lose all of the DOGs that you locked with us when you received that NFT. In that
        event, you may retain none of those DOGs and we will have no liability or obligation to you whatsoever. You
        further acknowledge and agree that there is substantial uncertainty as to the regulatory classification of NFTs
        and other digital assets under applicable law, and that application of new or existing laws to NFTs by
        regulators or others present risks which could adversely affect any value or utility of PIXEL NFTs, DOGS or
        PERKS, and the ability to offer PERKS or any Additional Services.
      </Section>
      <Section title={"Your Representations and Warranties"}>
        You represent and warrant that (1) these Terms constitute your valid, binding and enforceable obligations, (2)
        your participation in the Project, use or receipt of or participation in any Perks or Additional Services,
        holding or transfer of any Pixel NFT, transfer to us of any DOGs or other use of any of our services will not
        violate the rights of any person or violate any law or regulation of any jurisdiction, and (3) you are
        financially and technically sophisticated enough to understand the inherent risks associated with using
        cryptographic and blockchain-based systems, and that you have a working knowledge of the usage and intricacies
        of digital assets.
      </Section>
      <Section title={"Service Changes, Suspension and Termination; Applicable Law"}>
        You acknowledge and understand that we may regularly update, enhance, modify and otherwise change the Project or
        any related services, including by adding, removing or changing Perks or Additional Services, or by changing our
        rules or policies relating to the Project, locked Pixel Units, Pixel NFTs, Perks or Additional Services, in each
        case without notice and in our sole and absolute discretion. No such change shall be a breach of these Terms by
        us or give rise to any obligation or liability whatsoever on our part. You further acknowledge that we may
        terminate or suspend your use of the Project, any Perks or any Additional Services at any time, with or without
        notice, and that we shall have no liability or obligation as a result of any such termination or suspension. For
        the avoidance of doubt, in the event of any such termination or suspension, you will have a reasonable
        opportunity, at our discretion, subject to applicable laws and regulations, to burn your Pixel NFTs and obtain a
        refund as described above. We will under no circumstances have any obligation under these Terms or otherwise to
        violate any applicable law or regulation. Notwithstanding any other provision of these Terms, therefore, we are
        and will be excused from performing any obligations under these Terms to the extent that the performance of
        those obligations would, or we determine in our sole discretion that such performance might, violate any
        applicable law or regulations, and our failure to perform such obligations will not be deemed to be a violation
        of these Terms or give rise to any liability or obligation on our part.
      </Section>
      <Section title={"No Warranties by Us; Release"}>
        The Project, your Pixel NFTs, any Perks, any Additional Services and any materials or information relating to
        the Project, your Pixel NFTs, any Perks or any Additional Services, are provided AS IS, without any warranties.
        Without limiting the generality of the foregoing, we expressly disclaim all implied warranties, including, but
        not limited to, any implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement. The duration of any implied warranty that is not effectively disclaimed will be limited to the
        longer of (i) thirty (30) days from the date that you first accept these Terms and (ii) the shortest period
        allowed under applicable law. Some jurisdictions do not permit the disclaimer of implied warranties or
        limitations on how long an implied warranty lasts; therefore, some or all of the provisions of this section may
        not apply to you. You waive and release us from any and all liabilities, claims, causes of action, or damages
        arising from or in any way relating to the Project, any Perks, any Additional Services, any Pixel NFTs, any
        Pixel Units that you lock with us, or any related materials or information. Further, you waive the benefits and
        protections of California Civil Code § 1542 or any similar law or regulation in effect in the jurisdiction in
        which you reside. California Civil Code § 1542 provides: “[a] general release does not extend to claims that the
        creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the
        release and that, if known by him or her, would have materially affected his or her settlement with the debtor
        or released party.”
      </Section>
      <Section title={"Indemnification"}>
        You will be responsible for and will pay us and our affiliates, vendors, suppliers, service providers and
        personnel the amount of any loss, damage, fine, penalty, liability, cost or expense (including, but not limited
        to, reasonable attorneys{"'"} fees) (collectively, “Losses”) arising out of or in connection with your use of
        the Project, your Pixel NFT, any Perks, any Additional Services, any Pixel Units locked with us, or any related
        materials or information, but excluding any Losses to the extent attributable to our breach of these Terms or
        violation of any applicable law or regulation.{" "}
      </Section>
      <Section title={"Amendments to these Terms"}>
        We may change these Terms at any time by posting a new version of these Terms. We will make reasonable efforts
        to make our Members aware of any changes to these Terms; provided that you must monitor our website and social
        media accounts for any amendment to these Terms. Any amendment to these Terms will take effect ten days after we
        post it, except that we may provide for an earlier effective date in exigent circumstances. If you do not want
        to be bound by any amendment to these Terms, you must return your Pixel NFTs and divest yourself of your DOGs
        before those amendments take effect.
      </Section>
      <Section title={"Intellectual Property"}>
        As between you and us, we or our licensors own all intellectual property rights in or related to the Project,
        your Pixel NFT, any Perks, any Additional Services, and any related materials or information that we or any of
        our affiliates provide. You acknowledge and understand that we do not transfer any copyright or other
        intellectual property right to you, nor do we grant you any license or other rights whatsoever under any
        copyrights or other intellectual property. Further, you acknowledge and understand that an NFT is distinct from
        any digital file or information with which it is associated. Thus, the fact that you may own your Pixel NFT does
        not mean that you own or hold any license or other rights in or to the associated pixel or any other digital
        file or information. Any transfer or other activity or transaction involving your Pixel NFT, and any other
        activity relating to the Project or any related services, is at your sole risk.
      </Section>
      <Section title={"Warnings Regarding Posts or Communications"}>
        Members may be able to post comments or other information and otherwise communicate or interact with one another
        (collectively, “Communications”). You acknowledge that any information you disclose in a Communication may be
        publicly available and that you should exercise caution in deciding whether to include any personal, financial
        or other sensitive information in any Communication. If you choose to include any of your personally
        identifiable or other information in a Communication, you do so at your own risk. You acknowledge that we cannot
        prevent other Members from using Communications and personal information disclosed in any Communications, even
        if their use of that information violates the law or your personal privacy or safety. None of the Communications
        will be subject to any obligation, whether of confidentiality, attribution or otherwise, on our part, and we
        will not be liable for any use or disclosure of any Communications. When viewing or responding to any
        Communications, you should not assume that people are who they say they are, know what they say they know or are
        affiliated with whom they say they are affiliated with. Information contained in Communications may not be
        reliable, and it is not a good idea to make any decisions based solely or largely on information you cannot
        confirm. We are in no way responsible for the content or accuracy of any information in any Communication and
        will not be responsible or liable in any way for or in connection with any decisions you make or actions that
        you take or forego based on such information. We may and expressly reserve the right, but have no obligation, to
        monitor, review, analyze, store, alter or remove any Communication at any time, and to monitor, review or
        analyze your access to or use of any such Communications, in each case by manual, automated or other means, and
        in each case for any purpose. You acknowledge and agree that we have the right to disclose any information
        relating to any Communications, including, but not limited to, the circumstances surrounding its transmission
        and the identity of the person who initiated or received such Communication, to any third party for any reason
        or purpose. You acknowledge and agree that a Communication is not an effective way to provide us notices or
        otherwise communicate with us and that we shall not be deemed for any purpose to have knowledge of any
        information in any Communication.
      </Section>
      <Section title={"Code of Conduct"}>
        Whenever interacting with us or using our services or website to interact with other Members, and otherwise
        whenever you use our website or services or use, receive or participate in any Perk or Additional Service, you
        will comply with any community guidelines that we may publish and, at a minimum, you will not:
        <br /> • post or transmit any Communication or other content that is, or that we consider in our sole discretion
        to be, unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, offensive, immoral, obscene,
        pornographic, hateful, threatening or otherwise objectionable, including, but not limited to, anything that
        denigrates any group defined by race, religion, gender, national origin, sexual orientation or sexual identity,
        and further including, but not limited to, Communications that include expressions of bigotry, prejudice,
        racism, hatred or excessive profanity or that are obscene, lewd, lascivious, violent or harassing; • violate any
        local, state, federal, national or international law;
        <br /> • sell or promote any products or services;
        <br /> • introduce or transmit viruses, worms, Trojan horses or other malware;
        <br /> • display material that exploits children; • infringe or otherwise violate any copyright, patent,
        trademark, service mark, trade secret or other intellectual property right, right of publicity, moral right or
        other right of any individual or entity (“person”);
        <br /> • promote, solicit or participate in multi-level marketing or pyramid schemes;
        <br /> • harass, embarrass, defame or cause distress or discomfort to any person;
        <br /> • impersonate any person;
        <br /> • publish or disclose any personally identifying information or private information about anyone without
        their consent (or their parent’s consent in case of a person under the legal age of majority); or
        <br /> • publish or transmit any unsolicited advertising, promotional materials or any other forms of
        solicitation.
      </Section>
      <Section title={"Links to Other Web Sites"}>
        Our website or other services or communications with you may contain links to third-party web sites or services
        that are not owned or controlled by us, including, but not limited to, third-party services that you may use to
        store or transfer your Pixel NFT or to sell or purchase DOGs. No such link should be construed as an endorsement
        of any type. You acknowledge and understand that we have no control over, and assume no responsibility for, the
        services, goods or content provided by or made available at, or the privacy policies, terms of service or
        practices of, any third-party web sites or services. Accordingly, you access, use or acquire any such services,
        goods, content or site at your sole risk. We strongly advise you to read the terms of use, terms and conditions
        and privacy policies of any third-party web sites or services that you visit.
      </Section>
      <Section title={"Arbitration "}>
        Please read this provision very carefully. It limits your rights in the event of a dispute between you and us.
        You and we agree that any and all past, present and future disputes, controversies, claims, or causes of action
        arising out of or relating to the Project, your Pixel NFT(s) or any transaction relating to your Pixel NFT(s),
        any Pixel Units or other DOGs that you lock with us or any transaction involving those Pixel Units or other
        DOGs, your use or receipt of or participation in any Perks or Additional Services, your use of our website, or
        arising out of or relating to these Terms or the Privacy Policy, and any other controversies or disputes between
        you and us (including disputes regarding the effectiveness, scope, validity or enforceability of this agreement
        to arbitrate) (collectively, “Dispute(s)”), shall be determined by arbitration, unless (A) your Country of
        Residence does not allow this arbitration agreement; (B) you opt out as provided below; or (C) your Dispute is
        subject to an exception to this agreement to arbitrate set forth below. You and we further agree that any
        arbitration pursuant to this section shall not proceed as a class, group or representative action. The award of
        the arbitrator may be entered in any court having jurisdiction. “Country of Residence” for purposes of this
        agreement to arbitrate means the country in which you hold citizenship or legal permanent residence; provided
        that if you have more than one country of citizenship or legal permanent residence, it shall be the country in
        which you hold citizenship or legal permanent residence with which you most closely are associated by permanent
        or most frequent residence. We want to address your concerns without the need for a formal dispute resolution
        process. Before filing a claim against us, you agree to try to resolve the Dispute informally by contacting our
        agent in writing at Eternal Tunnel Corporation, 228 Park Ave S, PMB 45689, New York, New York 10003-1502, or via
        e-mail at doyou@ownthedoge.com, to notify us of the actual or potential Dispute. Similarly, we will undertake
        reasonable efforts to contact you to notify you of any actual or potential dispute to resolve any claim we may
        possess informally before taking any formal action. The party that provides the notice of the actual or
        potential Dispute (the “Notifying Party”) will include in that notice (a “Notice of Dispute”) your name (to the
        extent known), the Notifying Party’s contact information for any communications relating to such Dispute
        (including for the Notifying Party’s legal counsel if it is represented by counsel in connection with such
        Dispute), and sufficient details regarding such Dispute to enable the other party (the “Notified Party”) to
        understand the basis of and evaluate the concerns raised. If the Notified Party responds within ten (10)
        business days after receiving the Notice of Dispute that it is ready and willing to engage in good faith
        discussions in an effort to resolve the Dispute informally, then each party shall promptly participate in such
        discussions in good faith. If, notwithstanding the Notifying Party’s compliance with all of its obligations
        under the preceding paragraph, a Dispute is not resolved within 30 days after the Notice of Dispute is sent (or
        if the Notified Party fails to respond to the Notice of Dispute within ten (10) business days), the Notifying
        Party may initiate an arbitration proceeding as described below. If either party purports to initiate
        arbitration without first providing a Notice of Dispute and otherwise complying with all of its obligations
        under the preceding paragraph, then, notwithstanding any other provision of these Terms, the arbitrator(s) will
        promptly dismiss the claim with prejudice and will award the other party all of its costs and expenses
        (including reasonable attorneys’ fees) incurred in connection with such Dispute. Unless you opt out of this
        agreement to arbitrate as provided below, you and we each agree to resolve any Disputes that are not resolved
        informally as described above through final and binding arbitration as discussed herein, subject to the
        exceptions set forth below. If you do not wish to be subject to this agreement to arbitrate, you may opt out of
        this arbitration provision by sending a written notice to our agent Eternal Tunnel Corporation, 228 Park Ave S,
        PMB 45689, New York, New York 10003-1502, or via e-mail at doyou@ownthedoge.com, within thirty (30) days of the
        first time you accept these Terms (or any prior version of these Terms) or, if earlier, the first time you
        receive any Pixel NFT or use any of our services. You must date the notice and include your first and last name,
        address, and a clear statement that you do not wish to resolve disputes with us through arbitration. If no
        notice is submitted in the manner described above by the 30-day deadline, you will have irrevocably waived your
        right to litigate any Dispute except with regard to the exceptions set forth below. By opting out of the
        agreement to arbitrate, you will not be precluded from participating in the Project or from otherwise using any
        of our services, but you and we will not be permitted to invoke the mutual agreement to arbitrate to resolve
        Disputes under the terms otherwise provided herein. You and we agree that the American Arbitration Association
        (“AAA”) will administer the arbitration under its Commercial Arbitration Rules and the Supplementary Procedures
        for Consumer Related Disputes in effect at the time arbitration is sought (“AAA Rules”). Those rules are
        available at www.adr.org or by calling the AAA at 1-800-778-7879. A party who desires to initiate arbitration
        must provide the other party with a written Demand for Arbitration as specified in the AAA Rules. Arbitration
        will proceed on an individual basis and will be handled by a sole arbitrator. The single arbitrator will be
        either a retired judge or an attorney licensed to practice law and will be selected by the parties from the
        AAA’s roster of arbitrators. If the parties are unable to agree upon an arbitrator within fourteen (14) days of
        delivery of the Demand for Arbitration, then the AAA will appoint the arbitrator in accordance with the AAA
        Rules. The arbitrator(s) shall be authorized to award any remedies, including injunctive relief, that would be
        available in an individual lawsuit, other than remedies that you effectively waived pursuant to these Terms.
        Notwithstanding any language to the contrary in this paragraph, if a party seeks injunctive relief that would
        significantly impact other of our customers or users, as reasonably determined by either party, the parties
        agree that such arbitration will proceed on an individual basis but will be handled by a panel of three (3)
        arbitrators. In that event, each party shall select one arbitrator, and the two party-selected arbitrators shall
        select the third, who shall serve as chair of the arbitral panel. That chairperson shall be a retired judge, or
        an attorney licensed to practice law with experience arbitrating or mediating disputes. In the event of
        disagreement as to whether the threshold for a three-arbitrator panel has been met, the sole arbitrator
        appointed in accordance with this section shall make that determination. If the arbitrator determines a
        three-person panel is appropriate, the arbitrator may – if selected by either party or as the chair by the two
        party-selected arbitrators – participate in the arbitral panel. Except as may be and to the extent otherwise
        required by law, the arbitration proceeding and any award shall be confidential. You and we further agree that
        the arbitration will be held in the English language in New York, New York or, if we so elect, all proceedings
        can be conducted via videoconference, telephonically or via other remote electronic means. If we elect
        arbitration, we shall pay all of the AAA filing costs and administrative fees (other than hearing fees). If you
        elect arbitration, filing costs and administrative fees (other than hearing fees) shall be paid in accordance
        with the AAA Rules, or in accordance with countervailing law if contrary to the AAA Rules. However, if the value
        of the relief sought is $10,000 or less, at your request, we will pay all filing, administration, and arbitrator
        fees associated with the arbitration, unless the arbitrator(s) finds that either the substance of your claim or
        the relief sought was frivolous or was brought for an improper purpose (as measured by the standards set forth
        in Federal Rule of Civil Procedure 11(b)). In such circumstances, fees will be determined in accordance with the
        AAA Rules. Each party shall bear the expense of its own attorneys’ fees, except as otherwise provided herein or
        required by law. If your Country of Residence is the United States, this agreement to arbitrate shall be
        construed under and be subject to the Federal Arbitration Act (U.S. Code Article 9), notwithstanding any other
        choice of law set out in these Terms. Regardless of your County of Residence or the rules of a given arbitration
        forum, you and we agree that the arbitration of any Dispute shall proceed on an individual basis, and neither
        you nor we may bring a claim as a part of a class, group, collective, coordinated, consolidated or mass
        arbitration (each, a “Collective Arbitration”). Without limiting the generality of the foregoing, a claim to
        resolve any Dispute against us will be deemed a Collective Arbitration if (i) two (2) or more similar claims for
        arbitration are filed concurrently; and (ii) counsel for the claimants are the same, share fees or coordinate
        across the arbitrations. “Concurrently” for purposes of this provision means that both arbitrations are pending
        (filed but not yet resolved) at the same time. To the maximum extent permitted by applicable law, neither you
        nor we shall be entitled to consolidate, join or coordinate disputes by or against other individuals or entities
        with any Disputes, or to arbitrate or litigate any Dispute in a representative capacity, including as a
        representative member of a class or in a private attorney general capacity. In connection with any Dispute, any
        and all such rights are hereby expressly and unconditionally waived. Without limiting the foregoing, any
        challenge to the validity of this paragraph or otherwise relating to the prohibition of Collective Arbitration
        shall be determined exclusively by the arbitrator. Notwithstanding the agreement between you and us to arbitrate
        Disputes, you and we each retain the following rights: If your Country of Residence is the United States, you
        and we retain the right (A) to bring an individual action in small claims court; and (B) to seek injunctive or
        other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement,
        misappropriation or violation of a party’s copyrights, trademarks, trade secrets, patents or other intellectual
        property rights. If your Country of Residence is not the United States, you and we may assert claims, if they
        qualify, through the small claims process in the courts of your Country of Residence. Further, as applicable,
        this agreement to arbitrate does not deprive you of the protection of the mandatory provisions of the consumer
        protection laws in your Country of Residence; you shall retain any such rights and this agreement to arbitrate
        shall be construed accordingly. Except as otherwise required by applicable law or provided in these Terms, in
        the event that the agreement to arbitrate is found not to apply to you or your Dispute, you and we agree that
        any judicial proceeding may only be brought in a court of competent jurisdiction in Los Angeles, California.
        Both you and we consent to venue and personal jurisdiction in California. Notwithstanding the foregoing, either
        party may bring any action to enforce its intellectual property rights or confirm an arbitral award in any court
        or administrative agency having jurisdiction. This agreement to arbitrate shall survive the termination or
        expiration of these Terms. With the exception of the provisions of this agreement to arbitrate that prohibit
        Collective Arbitration, if a court decides that any part of this agreement to arbitrate is invalid or
        unenforceable, then the remaining portions of this agreement to arbitrate shall nevertheless remain valid and in
        force. If a court finds the prohibition of Collective Arbitration to be invalid or unenforceable, then the
        entirety of this agreement to arbitrate shall be deemed void (but no provisions of these Terms not specifically
        related to arbitration shall be void), and any remaining Dispute must be litigated in court pursuant to the
        preceding paragraph.
      </Section>
      <Section title={"Governing Law"}>
        These Terms shall be governed by and construed in accordance with the laws of the state of California applicable
        to contracts entered into and performed in California by residents thereof; provided that all provisions hereof
        related to arbitration shall be governed by and construed in accordance with the Federal Arbitration Act (U.S.
        Code Title 9) to the extent provided above.
      </Section>
      <Section title={"Exclusion of Damages and Limitation of Liability"}>
        In no event shall we, our affiliates, service providers or licensors, or our or their respective directors,
        shareholders, members, officers, employees, agents or representatives, be liable under these Terms or otherwise
        to you in connection with the Project, your Pixel NFT(s), any Perk, any Additional Service, or any related
        materials or information that we or our affiliate may provide, or any transaction involving, use or receipt of
        or participation in any of the foregoing, for: (i) any amounts greater than the value of the DOGs that you have
        locked with us as of the date of any claim giving rise to such liability (but not less than the value at that
        time of one Pixel Unit) or (ii) any lost profits or any special, incidental, indirect, consequential, exemplary
        or punitive damages, in either case whether based in contract, tort (including but not limited to negligence),
        strict liability, or otherwise, even if we have been advised of, or knew of, or should have known of, the
        likelihood of such damages. Some jurisdictions do not permit the exclusion or limitation of incidental or
        consequential damages; therefore, some or all of the limitations in this paragraph may not apply to you.
      </Section>
      <Section title={"No Waiver"}>
        If you breach these Terms and we do not immediately respond, or we do not respond at all, we will still be
        entitled to all rights and remedies at any later date, or in any other situation, where you breach these Terms.
        No failure to act or delay in acting by us will be deemed to be a waiver of any type.
      </Section>
      <Section title={"Assignment"}>
        You may not assign, sub-license or otherwise transfer any of your rights under these Terms. We may assign these
        Terms at any time, in our sole and absolute discretion, without notice.
      </Section>
      <Section title={"Enforceability"}>
        Except as provided above with respect to the provisions of these Terms prohibiting Collective Arbitration, if
        any provision of these Terms is held to be invalid, ineffective or unenforceable by a court of competent
        jurisdiction or arbitrator, the remaining provisions of these Terms will remain valid, effective and
        enforceable.{" "}
      </Section>
      <Section title={"Feedback"}>
        We welcome questions, comments and other feedback about these Terms, the Project, any Pixel NFTs, any Perks and
        any Additional Services, including ideas, proposals, suggestions or other materials (“Feedback”). However, you
        acknowledge and agree that we will treat all Feedback as non-confidential, and you hereby grant us a
        nonexclusive, worldwide, perpetual, irrevocable, royalty-free, fully-paid-up license to create derivative works
        based upon any of your Feedback and to reproduce, publicly display, publicly perform, use, commercialize,
        disclose, import and distribute such Feedback and derivative works in any way and for any purpose, and to assign
        or otherwise transfer such license or otherwise authorize others to do any of the foregoing, without notice or
        obligation to you. You further acknowledge and agree that your provision of Feedback is gratuitous, unsolicited
        and without restrictions, and does not place us under any fiduciary or other obligation.
      </Section>
      <Section title={"Important Note to New Jersey Consumers"}>
        If you are a consumer residing in New Jersey, the following provisions of these Terms do not apply to you (and
        do not limit any rights that you may have) to the extent that they are unenforceable under New Jersey law: (a)
        the disclaimer of liability for any indirect, incidental, consequential, special, exemplary or punitive damages
        of any kind (for example, to the extent unenforceable under the New Jersey Punitive Damages Act, New Jersey
        Products Liability Act, New Jersey Uniform Commercial Code and New Jersey Consumer Fraud Act); (b) the
        limitations of liability for lost profits or loss or misuse of any data (for example, to the extent
        unenforceable under the New Jersey Identity Theft Protection Act and New Jersey Consumer Fraud Act); (c)
        application of the limitations of liability to the recovery of damages that arise under contract and tort,
        including negligence, strict liability or any other theory (for example, to the extent such damages are
        recoverable by a consumer under New Jersey law, including the New Jersey Products Liability Act); (d) the
        requirement that you indemnify us and any other indemnified parties (for example, to the extent the scope of
        such indemnity is prohibited under New Jersey law); and (e) the governing law provision (for example, to the
        extent that your rights as a consumer residing in New Jersey are required to be governed by New Jersey law).
      </Section>
      <Section title={"Notice to California Residents"}>
        If you are a California resident, under California Civil Code Section 1789.3, you may contact the Complaint
        Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing
        at 1625 N. Market Blvd., Suite S-202, Sacramento, California 95834, or by telephone at (800) 952-5210 in order
        to resolve a complaint regarding the Project or any related services or to receive further information regarding
        use of the Project or any related services. For clarity, you remain obligated to arbitrate your Dispute in
        accordance with these Terms if your complaint is not resolved.
      </Section>
      <Section title={"Entire Agreement"}>
        These Terms (including any documents incorporated into these Terms by reference) constitute the entire agreement
        between you and us regarding the Project, any Pixel NFTs, any Perks, any Additional Services or any related
        materials or information that we may provide. If there exists any prior agreement, whether oral or written,
        regarding the Project, any Pixel NFTs, any Perks, any Additional Services or any related materials or
        information that we provide, that prior agreement is replaced by these Terms.
      </Section>
      <Section title={"CONTACT US"}>
        If you have any questions about these Terms, please{" "}
        <Link
          to={"mailto:doyou@ownthedoge.com"}
          fontSize={"14px"}
          size={"sm"}
          variant={Type.ComicSans}
          fontWeight={"bold"}
        >
          contact us
        </Link>
        .
      </Section>
    </Box>
  );
};

const Section: React.FC<PropsWithChildren<{ title?: string }>> = ({ children, title }) => {
  return (
    <Box my={5}>
      {title && (
        <Typography block variant={TVariant.ComicSans14} textDecoration="underline" fontWeight={"bold"}>
          {title}
        </Typography>
      )}
      <Typography block variant={TVariant.ComicSans14}>
        {children}
      </Typography>
    </Box>
  );
};

export default TermsPage;
